export interface LlmResponse {
  content: string;
  meta: {
    registry: {
      registry_hash: string;
      registry_version: string;
    };
    routing: {
      decision: string;
      confidence: number;
      bypass: boolean;
      features_hash: string;
    };
    retrieval: {
      context_hash: string;
      chunks_count: number;
      retrieval_latency_ms: number;
    };
    pre_intel: {
      tokens_saved_est: number;
      pruning_applied: boolean;
      language_detected: string;
    };
    policy: {
      policy_hash: string;
      guardrails_triggered: string[];
    };
    performance: {
      total_latency_ms: number;
      tokens_in: number;
      tokens_out: number;
    };
  };
  decision_trace_hash: string;
  schema_version: string;
  status: 'success' | 'degraded' | 'error';
  degrade_info?: {
    code: string;
    reason: string;
    fallback_used: boolean;
  };
}

export function buildLlmResponse(
  content: string,
  meta: Partial<LlmResponse['meta']>,
  options: {
    registryHash: string;
    registryVersion: string;
    decisionTrace: string;
    status?: LlmResponse['status'];
    degradeInfo?: LlmResponse['degrade_info'];
  }
): LlmResponse {
  return {
    content,
    meta: {
      registry: {
        registry_hash: options.registryHash,
        registry_version: options.registryVersion,
      },
      routing: meta.routing || {
        decision: 'direct',
        confidence: 1.0,
        bypass: false,
        features_hash: '',
      },
      retrieval: meta.retrieval || {
        context_hash: '',
        chunks_count: 0,
        retrieval_latency_ms: 0,
      },
      pre_intel: meta.pre_intel || {
        tokens_saved_est: 0,
        pruning_applied: false,
        language_detected: 'en',
      },
      policy: meta.policy || {
        policy_hash: '',
        guardrails_triggered: [],
      },
      performance: meta.performance || {
        total_latency_ms: 0,
        tokens_in: 0,
        tokens_out: 0,
      },
    },
    decision_trace_hash: options.decisionTrace,
    schema_version: '2025.01.1',
    status: options.status || 'success',
    degrade_info: options.degradeInfo,
  };
}