import { z } from 'zod'

// API Response Schema
export const ApiResponseSchema = z.object({
  data: z.unknown(),
  meta: z.object({
    request_id: z.string(),
    timestamp: z.string(),
    version: z.string().optional()
  }),
  error: z.string().optional()
})

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data: T
}

// API Client
class ApiClient {
  private baseURL = '/api'
  private requestId = () => crypto.randomUUID()

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': this.requestId(),
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const result = await response.json()
    const parsed = ApiResponseSchema.parse(result)
    return parsed.data as T
  }

  // Observability
  getObservabilitySummary() {
    return this.request('/ai/observability/summary')
  }

  // Router
  getRouterDecisions(params?: { limit?: number; since?: string }) {
    const query = new URLSearchParams(params as Record<string, string>)
    return this.request(`/ai/router/decisions?${query}`)
  }

  // RAG
  getRagChunk(id: string) {
    return this.request(`/ai/rag/chunks/${id}`)
  }

  // Orchestrator
  runTask(task: string, args?: Record<string, unknown>) {
    return this.request('/ops/orchestrator/run', {
      method: 'POST',
      body: JSON.stringify({ task, args })
    })
  }

  getArtifacts(params: { task: string; id?: string }) {
    const query = new URLSearchParams(params as Record<string, string>)
    return this.request(`/ops/orchestrator/artifacts?${query}`)
  }
}

export const apiClient = new ApiClient()