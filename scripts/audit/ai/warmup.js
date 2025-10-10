#!/usr/bin/env node
/**
 * AURA AI Warm-up Script
 * - Prechauffe embeddings & LLM pour stabiliser la latence et remplir les caches
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const args = require('minimist')(process.argv.slice(2));
const EMB_N = Number(args.embeddings || 25);
const LLM_N = Number(args.llm || 25);
const DATASET = args.dataset || 'scripts/audit/ai/router-bench.dataset.json';

function log(msg) { console.log(`[warmup] ${msg}`); }

function ensureCaches() {
  const { HF_HOME, HF_HUB_CACHE, AURA_EMBED_CACHE_DIR } = process.env;
  const dirs = [
    HF_HOME || path.join(os.homedir(), '.cache', 'huggingface'),
    HF_HUB_CACHE || path.join(os.homedir(), '.cache', 'huggingface', 'hub'),
    AURA_EMBED_CACHE_DIR || path.join(os.homedir(), '.cache', 'aura', 'embeddings')
  ];
  dirs.forEach(d => { 
    fs.mkdirSync(d, { recursive: true }); 
    log(`ensure dir: ${d}`); 
  });
}

async function warmupEmbeddings(n) {
  log(`Embeddings warm-up x${n}...`);
  const testTexts = [
    "Sample text for embedding warmup",
    "Another test sentence for cache initialization",
    "Multi-language test: Bonjour le monde",
    "Embedding cache warm-up sequence"
  ];
  
  for (let i = 0; i < n; i++) {
    const text = testTexts[i % testTexts.length];
    // Simulate embedding call - replace with actual service call
    await new Promise(r => setTimeout(r, Math.random() * 10 + 5));
    if (i % 10 === 0) log(`embeddings progress: ${i}/${n}`);
  }
  log('Embeddings warm-up done.');
}

async function warmupLLM(n, datasetPath) {
  log(`LLM warm-up x${n}...`);
  let samples = [];
  try {
    const raw = fs.readFileSync(datasetPath, 'utf8');
    samples = JSON.parse(raw).samples || [];
  } catch (e) {
    log(`Warning: Could not load dataset ${datasetPath}, using fallback`);
    samples = [{ text: 'Warmup prompt for LLM initialization' }];
  }
  
  for (let i = 0; i < n; i++) {
    const s = samples[i % samples.length];
    // Simulate LLM call - replace with actual Qwen service call
    await new Promise(r => setTimeout(r, Math.random() * 20 + 10));
    if (i % 5 === 0) log(`llm progress: ${i}/${n}`);
  }
  log('LLM warm-up done.');
}

(async () => {
  const start = Date.now();
  log(`Starting warm-up: embeddings=${EMB_N}, llm=${LLM_N}`);
  
  ensureCaches();
  await warmupEmbeddings(EMB_N);
  await warmupLLM(LLM_N, DATASET);
  
  const duration = Date.now() - start;
  log(`Warm-up complete in ${duration}ms`);
})().catch(console.error);