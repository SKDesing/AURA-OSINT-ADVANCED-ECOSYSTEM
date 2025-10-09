#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const METRICS_FILE = 'logs/run/final/metrics.prom';

function extractTotal(name, metricsContent) {
  const lines = metricsContent.split('\n');
  let sum = 0;
  
  lines.forEach(line => {
    if (line.startsWith(name)) {
      const match = line.match(/(\d+(?:\.\d+)?)$/);
      if (match) {
        sum += parseFloat(match[1]);
      }
    }
  });
  
  return sum;
}

function extractCacheHits(result, metricsContent) {
  const lines = metricsContent.split('\n');
  let sum = 0;
  
  lines.forEach(line => {
    if (line.includes('ai_semantic_cache_hits_total') && line.includes(`result="${result}"`)) {
      const match = line.match(/(\d+(?:\.\d+)?)$/);
      if (match) {
        sum += parseFloat(match[1]);
      }
    }
  });
  
  return sum;
}

function main() {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  
  if (!fs.existsSync(METRICS_FILE)) {
    console.error(`Metrics file absent: ${METRICS_FILE}`);
    process.exit(1);
  }
  
  const metricsContent = fs.readFileSync(METRICS_FILE, 'utf8');
  
  const tokIn = extractTotal('ai_tokens_input_total', metricsContent);
  const tokOut = extractTotal('ai_tokens_output_total', metricsContent);
  const tokSaved = extractTotal('ai_tokens_saved_total', metricsContent);
  const pruneEvt = extractTotal('ai_pruning_events_total', metricsContent);
  const semHits = extractCacheHits('hit', metricsContent);
  const semMiss = extractCacheHits('miss', metricsContent);
  const ragRet = extractTotal('rag_retrieved_chunks_total', metricsContent);
  const ragIng = extractTotal('rag_ingested_chunks_total', metricsContent);
  
  const total = tokIn + tokOut;
  const tokensRatio = total > 0 ? (tokSaved / total) : 0;
  const cacheTotal = semHits + semMiss;
  const cacheRatio = cacheTotal > 0 ? (semHits / cacheTotal) : 0;
  
  const metrics = {
    tokens_in: tokIn,
    tokens_out: tokOut,
    tokens_saved: tokSaved,
    tokens_saved_ratio: tokensRatio,
    pruning_events: pruneEvt,
    cache_hit_ratio: cacheRatio,
    rag_retrieved_chunks: ragRet,
    rag_ingested_chunks: ragIng,
    degrade_ratio: 0.01, // Placeholder - to be calculated from actual degrade events
    router_bypass_rate: 0.67, // Placeholder - to be calculated from router decisions
    generated_at: new Date().toISOString()
  };
  
  if (outputJson) {
    // Ensure reports directory exists
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(reportsDir, 'KPIS-Daily.json'),
      JSON.stringify(metrics, null, 2)
    );
    console.log('📊 Metrics saved to reports/KPIS-Daily.json');
  } else {
    // Legacy format
    console.log(`TOKENS_IN=${tokIn}`);
    console.log(`TOKENS_OUT=${tokOut}`);
    console.log(`TOKENS_SAVED=${tokSaved}`);
    console.log(`TOKENS_SAVED_RATIO=${(tokensRatio * 100).toFixed(2)}%`);
    console.log(`PRUNING_EVENTS=${pruneEvt}`);
    console.log(`SEM_CACHE_HIT_RATIO=${(cacheRatio * 100).toFixed(2)}%`);
    console.log(`RAG_RETRIEVED_CHUNKS_TOTAL=${ragRet}`);
    console.log(`RAG_INGESTED_CHUNKS_TOTAL=${ragIng}`);
  }
}

if (require.main === module) {
  main();
}