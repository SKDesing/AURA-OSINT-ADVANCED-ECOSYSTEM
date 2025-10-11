export interface ApiClient {
  request<T = unknown>(path: string, init?: RequestInit): Promise<T>;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4010';

export const apiClient: ApiClient = {
  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(
      path.startsWith('http') ? path : `${BASE_URL}${path}`,
      {
        headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
        ...init,
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const ct = res.headers.get('content-type') || '';
    return (ct.includes('application/json') ? res.json() : (res.text() as any)) as T;
  },
};