import client from 'prom-client';

export const registry = new client.Registry();
registry.setDefaultLabels({ service: 'aura-ai-gateway' });

export const metrics = {
  aiRequestTotal: new client.Counter({
    name: 'ai_request_total',
    help: 'Total AI requests processed',
    labelNames: ['model', 'status', 'engine'],
    registers: [registry]
  }),

  aiLatencyMs: new client.Histogram({
    name: 'ai_latency_ms',
    help: 'AI request latency in milliseconds',
    labelNames: ['model', 'engine'],
    buckets: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
    registers: [registry]
  }),

  aiTokensInput: new client.Counter({
    name: 'ai_tokens_input_total',
    help: 'Total input tokens processed',
    labelNames: ['model'],
    registers: [registry]
  }),

  aiTokensOutput: new client.Counter({
    name: 'ai_tokens_output_total',
    help: 'Total output tokens generated',
    labelNames: ['model'],
    registers: [registry]
  }),

  aiGuardrailsBlocked: new client.Counter({
    name: 'ai_guardrails_blocked_total',
    help: 'Total requests blocked by guardrails',
    labelNames: ['reason'],
    registers: [registry]
  }),

  aiTokensSaved: new client.Counter({
    name: 'ai_tokens_saved_total',
    help: 'Tokens économisés via pruning',
    labelNames: ['reason'],
    registers: [registry]
  }),

  aiPruningEvents: new client.Counter({
    name: 'ai_pruning_events_total',
    help: 'Événements de pruning',
    labelNames: ['type'],
    registers: [registry]
  }),

  aiCacheHits: new client.Counter({
    name: 'ai_semantic_cache_hits_total',
    help: 'Hits cache sémantique',
    labelNames: ['result'],
    registers: [registry]
  }),

  // Router Metrics
  aiRouterDecision: new client.Counter({
    name: 'ai_router_decision_total',
    help: 'Total router decisions by algorithm',
    labelNames: ['decision'],
    registers: [registry]
  }),

  aiRouterTokensSaved: new client.Counter({
    name: 'ai_router_tokens_saved_total',
    help: 'Total tokens saved by algorithm routing',
    registers: [registry]
  }),

  aiRouterAccuracy: new client.Gauge({
    name: 'ai_router_accuracy',
    help: 'Router decision accuracy percentage',
    registers: [registry]
  }),

  aiRouterBypassRate: new client.Gauge({
    name: 'ai_router_bypass_rate',
    help: 'Percentage of requests bypassing LLM',
    registers: [registry]
  })
};

client.collectDefaultMetrics({ register: registry });