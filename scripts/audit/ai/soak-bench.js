#!/usr/bin/env node
/**
 * AURA AI Soak/Concurrency Bench
 * - Durée (min), parallélisme, mesure p50/p95/p99, error_rate
 */
const os = require('os');
const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const durationMin = Number(args.duration || 10);
const concurrency = Number(args.concurrency || 8);
const endpoint = args.endpoint || 'http://localhost:4010/ai/health';
const start = Date.now();
let ok = 0, ko = 0;
const lat = [];

function pctl(a, p) { 
  if (!a.length) return 0; 
  const s = [...a].sort((x, y) => x - y); 
  const k = Math.floor((p / 100) * s.length); 
  return s[Math.min(k, s.length - 1)]; 
}

async function one() {
  const t0 = Date.now();
  try {
    const res = await fetch(endpoint, { 
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    if (!res.ok) throw new Error(String(res.status));
    await res.json();
    ok++; 
    lat.push(Date.now() - t0);
  } catch {
    ko++;
  }
}

async function worker() {
  while (Date.now() - start < durationMin * 60_000) {
    await one();
    await new Promise(r => setTimeout(r, 100)); // 100ms between requests
  }
}

(async () => {
  console.log(`🔄 Starting soak test: ${durationMin}min, ${concurrency} workers, endpoint=${endpoint}`);
  
  await Promise.all(Array.from({ length: concurrency }, worker));
  
  const report = {
    timestamp: new Date().toISOString(),
    config: {
      duration_min: durationMin,
      concurrency,
      endpoint,
      total_duration_ms: Date.now() - start
    },
    system: { 
      os: `${os.type()} ${os.release()}`, 
      cpu: os.cpus()[0]?.model || 'unknown', 
      ram_gb: Math.round(os.totalmem() / 1e9), 
      node: process.version
    },
    results: { 
      ok, 
      ko, 
      total_requests: ok + ko,
      error_rate: (ko / (ok + ko) || 0),
      rps: Math.round((ok + ko) / (durationMin * 60))
    },
    latency_ms: { 
      p50: Math.round(pctl(lat, 50) * 100) / 100, 
      p95: Math.round(pctl(lat, 95) * 100) / 100, 
      p99: Math.round(pctl(lat, 99) * 100) / 100,
      avg: lat.length ? Math.round((lat.reduce((a, b) => a + b, 0) / lat.length) * 100) / 100 : 0,
      count: lat.length 
    },
    recommendations: []
  };

  // Add recommendations
  if (report.results.error_rate > 0.01) {
    report.recommendations.push(`High error rate ${(report.results.error_rate * 100).toFixed(2)}% - investigate failures`);
  }
  
  if (report.latency_ms.p99 > 2000) {
    report.recommendations.push(`P99 latency ${report.latency_ms.p99}ms > 2s - optimize performance`);
  }
  
  if (report.results.rps < 10) {
    report.recommendations.push(`Low throughput ${report.results.rps} RPS - scale or optimize`);
  }

  // Write report
  const reportPath = path.join(process.cwd(), 'reports/audit/AI/soak-bench.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`✅ Soak test complete: ${reportPath}`);
  console.log(`📊 Requests: ${report.results.total_requests} (${report.results.ok} ok, ${report.results.ko} failed)`);
  console.log(`⚡ Latency P50/P95/P99: ${report.latency_ms.p50}/${report.latency_ms.p95}/${report.latency_ms.p99}ms`);
  console.log(`🎯 RPS: ${report.results.rps}, Error rate: ${(report.results.error_rate * 100).toFixed(2)}%`);
  
  if (report.recommendations.length > 0) {
    console.log(`⚠️ Recommendations: ${report.recommendations.join(', ')}`);
  }
})();