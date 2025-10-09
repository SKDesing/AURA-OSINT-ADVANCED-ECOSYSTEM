import { useQuery } from '@tanstack/react-query'
import { useSSE } from '@/core/hooks/useSSE'
import { apiClient } from '@/core/api/client'
import { StatTile } from '@/shared/ui/StatTile'
import { TrendChart } from '@/shared/charts/TrendChart'

interface ObservabilityMetrics {
  tokens_saved_ratio: number
  cache_hit_ratio: number
  rag_p95: number
  router_bypass_rate: number
  guardrail_block_rate: number
  degrade_ratio: number
}

export function ObservabilityDashboard() {
  // Static metrics
  const { data: summary, isLoading } = useQuery({
    queryKey: ['observability', 'summary'],
    queryFn: () => apiClient.getObservabilitySummary(),
    refetchInterval: 30000
  })

  // Live metrics stream
  const { data: liveMetrics, isConnected } = useSSE<ObservabilityMetrics>(
    '/api/ai/stream/metrics'
  )

  const metrics = liveMetrics || summary

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Observability Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatTile
          title="Tokens Saved"
          value={metrics?.tokens_saved_ratio || 0}
          format="percentage"
          trend="up"
        />
        <StatTile
          title="Cache Hit Rate"
          value={metrics?.cache_hit_ratio || 0}
          format="percentage"
          trend="up"
        />
        <StatTile
          title="RAG P95"
          value={metrics?.rag_p95 || 0}
          format="duration"
          trend="down"
        />
        <StatTile
          title="Router Bypass"
          value={metrics?.router_bypass_rate || 0}
          format="percentage"
          trend="neutral"
        />
        <StatTile
          title="Guardrail Blocks"
          value={metrics?.guardrail_block_rate || 0}
          format="percentage"
          trend="up"
        />
        <StatTile
          title="Degradation"
          value={metrics?.degrade_ratio || 0}
          format="percentage"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          title="Performance Trends"
          data={[]} // TODO: Historical data
        />
        <TrendChart
          title="Error Rates"
          data={[]} // TODO: Error data
        />
      </div>
    </div>
  )
}