import { register, Histogram, Counter, Gauge } from 'prom-client';

// Latency metrics
export const aiPreintelLatency = new Histogram({
  name: 'ai_preintel_latency_ms',
  help: 'Pre-intelligence processing latency in milliseconds',
  buckets: [10, 25, 50, 100, 250, 500, 1000],
  labelNames: ['operation']
});

export const aiRetrievalLatency = new Histogram({
  name: 'ai_retrieval_latency_ms', 
  help: 'RAG retrieval latency in milliseconds',
  buckets: [50, 100, 250, 500, 1000, 2000],
  labelNames: ['chunks_count']
});

// Decision metrics
export const routerDecisionTotal = new Counter({
  name: 'ai_router_decision_total',
  help: 'Total router decisions by type',
  labelNames: ['decision', 'bypass']
});

export const guardrailsTriggerTotal = new Counter({
  name: 'ai_guardrails_trigger_total',
  help: 'Total guardrails triggers by category',
  labelNames: ['category', 'action']
});

// Efficiency metrics
export const tokensEfficiencyRatio = new Gauge({
  name: 'ai_llm_efficiency_ratio',
  help: 'Ratio of tokens saved vs total tokens processed'
});

export const cacheHitRatio = new Gauge({
  name: 'ai_cache_hit_ratio',
  help: 'Cache hit ratio for semantic cache',
  labelNames: ['cache_type']
});

// Registry integrity
export const registryIntegrityCheck = new Counter({
  name: 'ai_registry_integrity_check_total',
  help: 'Registry integrity checks',
  labelNames: ['status']
});

// Tokens saved metric
export const aiTokensSaved = new Counter({
  name: 'ai_tokens_saved_total',
  help: 'Total tokens saved through pre-intelligence optimizations',
  labelNames: ['model', 'optimization_type']
});

// Router bypass metric
export const routerBypassTotal = new Counter({
  name: 'ai_router_bypass_total',
  help: 'Total router bypass decisions'
});

// Router confidence histogram
export const routerConfidenceBucket = new Histogram({
  name: 'ai_router_confidence_bucket',
  help: 'Router decision confidence distribution',
  buckets: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
});

// Register all metrics
register.registerMetric(aiPreintelLatency);
register.registerMetric(aiRetrievalLatency);
register.registerMetric(routerDecisionTotal);
register.registerMetric(guardrailsTriggerTotal);
register.registerMetric(tokensEfficiencyRatio);
register.registerMetric(cacheHitRatio);
register.registerMetric(registryIntegrityCheck);
register.registerMetric(aiTokensSaved);
register.registerMetric(routerBypassTotal);
register.registerMetric(routerConfidenceBucket);