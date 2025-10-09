// Observability Dashboard - KPIs temps réel
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../core/api/client';

interface Metrics {
  tokens_saved_ratio: number;
  cache_hit_ratio: number;
  rag_p95: number;
  router_bypass_rate: number;
}

export const ObservabilityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await apiClient.getObservabilityMetrics();
        setMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load metrics:', error);
        setLoading(false);
      }
    };

    // Initial load
    loadMetrics();

    // Setup SSE with fallback to polling
    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    try {
      eventSource = apiClient.createSSEStream('/ai/stream/metrics');
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'metrics' && data.payload) {
          setMetrics(data.payload);
        }
      };

      eventSource.onerror = () => {
        console.warn('SSE connection failed, falling back to polling');
        eventSource?.close();
        pollInterval = setInterval(loadMetrics, 5000);
      };
    } catch (error) {
      console.warn('SSE not supported, using polling');
      pollInterval = setInterval(loadMetrics, 5000);
    }

    return () => {
      eventSource?.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  if (loading) return <div className="animate-pulse">Loading metrics...</div>;
  if (!metrics) return <div className="text-red-500">Failed to load metrics</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      <MetricCard 
        title="Tokens Saved" 
        value={`${(metrics.tokens_saved_ratio * 100).toFixed(1)}%`}
        trend="up"
      />
      <MetricCard 
        title="Cache Hit Rate" 
        value={`${(metrics.cache_hit_ratio * 100).toFixed(1)}%`}
        trend="up"
      />
      <MetricCard 
        title="RAG P95" 
        value={`${metrics.rag_p95.toFixed(0)}ms`}
        trend="down"
      />
      <MetricCard 
        title="Router Bypass" 
        value={`${(metrics.router_bypass_rate * 100).toFixed(1)}%`}
        trend="stable"
      />
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}> = ({ title, value, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <div className="flex items-center justify-between mt-2">
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      <TrendIcon trend={trend} />
    </div>
  </div>
);

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  const colors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-400'
  };
  
  return <div className={`w-4 h-4 ${colors[trend]}`}>📊</div>;
};