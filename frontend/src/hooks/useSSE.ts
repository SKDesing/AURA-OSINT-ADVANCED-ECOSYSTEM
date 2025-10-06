'use client';

import { useEffect, useRef, useState } from 'react';
import { SSEEvent, SSEEventSchema } from '@/lib/api/consolidated-schema';

export function useSSE(topics: string[] = ['job.update', 'job.done']) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('topics', topics.join(','));
    
    const eventSource = new EventSource(`http://localhost:4002/events?${params}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const parsed = SSEEventSchema.parse(data);
        setEvents(prev => [...prev.slice(-99), parsed]);
      } catch (error) {
        console.error('SSE parse error:', error);
      }
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [topics.join(',')]);

  return { events, isConnected };
}