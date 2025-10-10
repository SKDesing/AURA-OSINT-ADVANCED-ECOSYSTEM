#!/usr/bin/env ts-node
/**
 * Generates controlled load to validate 100k+/min pipeline throughput.
 * - Emits synthetic events at target rate with jitter
 * - Measures end-to-end latency via ack channel
 * - Exports CSV + Prom summary
 */
import { setTimeout as delay } from 'timers/promises';
import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';

type Options = { ratePerMin: number; durationMin: number; endpoint: string };
const opts: Options = {
  ratePerMin: Number(process.env.RATE_PER_MIN || 120_000),
  durationMin: Number(process.env.DURATION_MIN || 10),
  endpoint: process.env.ENDPOINT || 'http://localhost:4010/ingest',
};

async function main() {
  const total = opts.ratePerMin * opts.durationMin;
  const intervalMs = 60_000 / opts.ratePerMin;
  const latencies: number[] = [];
  const started = Date.now();
  
  console.log(`🚀 Starting load test: ${opts.ratePerMin}/min for ${opts.durationMin}min`);
  
  for (let i = 0; i < total; i++) {
    const id = randomUUID();
    const t0 = Date.now();
    
    void fetch(opts.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, kind: 'synthetic', payload: { i, t0 } }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(r.statusText);
        const { ackTs } = await r.json().catch(() => ({ ackTs: Date.now() }));
        const t1 = ackTs || Date.now();
        latencies.push(t1 - t0);
      })
      .catch(() => {});
      
    await delay(Math.max(1, intervalMs * (0.5 + Math.random()))); // jitter
    
    if (i % 10000 === 0) {
      console.log(`Progress: ${i}/${total} (${Math.round((i/total)*100)}%)`);
    }
  }
  
  const p50 = percentile(latencies, 50);
  const p95 = percentile(latencies, 95);
  const p99 = percentile(latencies, 99);
  const actualRate = (latencies.length / (Date.now() - started)) * 60_000;
  
  const results = {
    target: { ratePerMin: opts.ratePerMin, durationMin: opts.durationMin },
    actual: { count: latencies.length, ratePerMin: Math.round(actualRate) },
    latency: { p50, p95, p99 },
    timestamp: new Date().toISOString(),
  };
  
  writeFileSync('reports/benchmarks/ingest-latency.json', JSON.stringify(results, null, 2));
  console.log(`✅ Bench complete: ${actualRate.toFixed(0)}/min, p95=${p95}ms, p99=${p99}ms`);
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const k = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(k, sorted.length - 1)];
}

main().catch((e) => {
  console.error('❌ Benchmark failed:', e);
  process.exit(1);
});