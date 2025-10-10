const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4011';

type FetchOptions = RequestInit & { query?: Record<string, string | number | boolean | undefined> };

function buildUrl(path: string, query?: FetchOptions['query']) {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, API_BASE);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiGet<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(path, opts.query), {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: any, opts: FetchOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(path, opts.query), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export function openSSE(path: string, query?: Record<string, any>) {
  const url = buildUrl(path, query);
  return new EventSource(url, { withCredentials: true });
}