import { ApiError, ErrorSchema } from './openapi-schema';

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl = 'http://localhost:4002') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = ErrorSchema.safeParse(data);
        if (error.success) {
          throw new ApiError(error.data.error.message, error.data.error);
        }
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', { code: 'NETWORK_ERROR', message: String(error) });
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Jobs endpoints
  async getJobs(params?: { status?: string; limit?: number; cursor?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    
    return this.request(`/jobs?${searchParams}`);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, { method: 'DELETE' });
  }

  // TikTok endpoints
  async analyzeTikTok(data: { url?: string; handle?: string; options?: any }) {
    return this.request('/tiktok/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTikTokSessions(params?: { limit?: number; cursor?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    
    return this.request(`/tiktok/sessions?${searchParams}`);
  }

  async getTikTokSession(id: string) {
    return this.request(`/tiktok/sessions/${id}`);
  }

  // SSE connection
  createEventSource(topics: string[] = ['job.update', 'job.done']) {
    const params = new URLSearchParams();
    params.set('topics', topics.join(','));
    return new EventSource(`${this.baseUrl}/events?${params}`);
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public details?: { code: string; message: string; details?: any; traceId?: string }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();