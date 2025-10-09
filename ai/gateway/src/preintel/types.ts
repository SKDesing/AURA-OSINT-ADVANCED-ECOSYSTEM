export interface PreIntelConfig {
  simhash: {
    enabled: boolean;
    threshold: number;
  };
  pruning: {
    enabled: boolean;
    maxRatio: number;
    preserveQuestions: boolean;
  };
  cache: {
    enabled: boolean;
    maxSize: number;
    ttlMs: number;
  };
  language: {
    autoDetect: boolean;
    fallback: string;
  };
}

export interface PreIntelMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  averageLatencyMs: number;
  totalTokensSaved: number;
  pruningEvents: number;
  duplicateDetections: number;
}

export const DEFAULT_PREINTEL_CONFIG: PreIntelConfig = {
  simhash: {
    enabled: true,
    threshold: 0.85
  },
  pruning: {
    enabled: true,
    maxRatio: 0.3,
    preserveQuestions: true
  },
  cache: {
    enabled: true,
    maxSize: 1000,
    ttlMs: 3600000 // 1 hour
  },
  language: {
    autoDetect: true,
    fallback: 'en'
  }
};