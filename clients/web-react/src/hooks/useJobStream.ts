import { useEffect, useRef, useState } from 'react';

export function useJobStream(jobId?: string | number) {
  const [status, setStatus] = useState<'queued' | 'active' | 'completed' | 'failed' | 'unknown'>('unknown');
  const [payload, setPayload] = useState<any>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const base = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4011';
    const es = new EventSource(`${base}/api/osint/jobs/${jobId}/stream`, { withCredentials: true });
    esRef.current = es;
    es.addEventListener('open', () => setStatus('queued'));
    es.addEventListener('active', () => setStatus('active'));
    es.addEventListener('completed', (e: any) => { setStatus('completed'); try { setPayload(JSON.parse(e.data)); } catch {} });
    es.addEventListener('failed', (e: any) => { setStatus('failed'); try { setPayload(JSON.parse(e.data)); } catch {} });
    return () => { es.close(); esRef.current = null; };
  }, [jobId]);

  return { status, payload };
}