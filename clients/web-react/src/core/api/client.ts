// AURA API Client - Typed & Secure
import { z } from 'zod';

const ObservabilitySchema = z.object({
  tokens_saved_ratio: z.number(),
  cache_hit_ratio: z.number(),
  rag_p95: z.number(),
  router_bypass_rate: z.number()
});

class AuraApiClient {
  private baseURL: string;
  private requestId = crypto.randomUUID();

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'http://localhost:4010';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': this.requestId,
        ...options.headers,
      },
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async getObservabilityMetrics() {
    const data = await this.request('/ai/observability/summary');
    return ObservabilitySchema.parse(data);
  }

  async runTask(task: string, args: Record<string, any> = {}) {
    return this.request('/ops/orchestrator/run', {
      method: 'POST',
      body: JSON.stringify({ task, args })
    });
  }

  createSSEStream(endpoint: string): EventSource {
    return new EventSource(`${this.baseURL}${endpoint}`);
  }
}

export const apiClient = new AuraApiClient();