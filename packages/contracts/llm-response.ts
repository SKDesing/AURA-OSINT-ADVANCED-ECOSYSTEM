export interface LlmResponseContract {
  schema_version: string;
  request_id: string;
  status: 'ok' | 'error' | 'degraded';
  degrade: boolean;
  
  model: {
    alias: string;
    base: string;
    hash: string;
    context_used_tokens: number;
  };
  
  routing: {
    decision: 'ner' | 'forensic' | 'nlp' | 'harassment' | 'rag+llm' | 'llm';
    confidence: number;
    reason: string;
    features: string[];
  };
  
  retrieval?: {
    chunks_used: number;
    chunks_pruned: number;
    tokens_context: number;
    context_hash: string;
  };
  
  pre_intel: {
    lexical_score: number;
    language: string;
    pruning: {
      tokens_saved_est: number;
      dropped_similar: number;
      dropped_limit: number;
    };
    cache: {
      layer: 'semantic' | 'rag' | 'none';
      hit: boolean;
    };
    processing_time_ms: number;
  };
  
  tokens: {
    input: number;
    output: number;
    saved_total: number;
  };
  
  output: {
    type: 'text' | 'json' | 'error';
    text?: string;
    data?: any;
  };
  
  policy: {
    guardrails_version: string;
    blocked: boolean;
    rules_triggered: string[];
  };
  
  decision_trace_hash: string;
  latency_ms: number;
  error?: string;
}

export function buildLlmResponse(params: {
  requestId: string;
  model: any;
  routing: any;
  preIntel: any;
  tokens: any;
  output: any;
  policy: any;
  retrieval?: any;
  error?: string;
  startTime: number;
}): LlmResponseContract {
  const { requestId, model, routing, preIntel, tokens, output, policy, retrieval, error, startTime } = params;
  
  // Generate decision trace hash
  const traceComponents = [
    preIntel.normalizedText || '',
    routing.decision,
    retrieval?.context_hash || '',
    policy.guardrails_version
  ];
  const decisionTraceHash = require('crypto')
    .createHash('sha256')
    .update(traceComponents.join('|'))
    .digest('hex');
  
  return {
    schema_version: '2.0.0',
    request_id: requestId,
    status: error ? 'error' : (routing.decision === 'llm' && model.degraded ? 'degraded' : 'ok'),
    degrade: routing.decision === 'llm' && model.degraded,
    
    model: {
      alias: model.alias || 'aura-osint-ai-1.0',
      base: model.base || 'qwen2-1_5b',
      hash: model.hash || 'sha256:placeholder',
      context_used_tokens: tokens.input + (retrieval?.tokens_context || 0)
    },
    
    routing: {
      decision: routing.decision,
      confidence: routing.confidence,
      reason: routing.reason,
      features: routing.features || []
    },
    
    retrieval: retrieval ? {
      chunks_used: retrieval.chunks_used,
      chunks_pruned: retrieval.chunks_pruned,
      tokens_context: retrieval.tokens_context,
      context_hash: retrieval.context_hash
    } : undefined,
    
    pre_intel: {
      lexical_score: preIntel.lexicalScore,
      language: preIntel.language,
      pruning: {
        tokens_saved_est: preIntel.pruningStats?.tokensSavedEst || 0,
        dropped_similar: preIntel.pruningStats?.droppedSimilar || 0,
        dropped_limit: preIntel.pruningStats?.droppedLimit || 0
      },
      cache: {
        layer: preIntel.cache?.hit ? 'semantic' : 'none',
        hit: preIntel.cache?.hit || false
      },
      processing_time_ms: preIntel.processingTime || 0
    },
    
    tokens: {
      input: tokens.input,
      output: tokens.output,
      saved_total: tokens.saved || preIntel.pruningStats?.tokensSavedEst || 0
    },
    
    output: {
      type: error ? 'error' : 'text',
      text: output.text,
      data: output.data
    },
    
    policy: {
      guardrails_version: policy.version || 'guardrails-v1',
      blocked: policy.blocked || false,
      rules_triggered: policy.rules_triggered || []
    },
    
    decision_trace_hash: decisionTraceHash,
    latency_ms: Date.now() - startTime,
    error: error || undefined
  };
}