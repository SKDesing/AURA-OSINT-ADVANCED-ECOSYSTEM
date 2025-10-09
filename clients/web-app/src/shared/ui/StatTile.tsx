import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatTileProps {
  title: string
  value: number
  format?: 'number' | 'percentage' | 'duration' | 'bytes'
  trend?: 'up' | 'down' | 'neutral'
  change?: number
}

export function StatTile({ title, value, format = 'number', trend, change }: StatTileProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`
      case 'duration':
        return `${val.toFixed(0)}ms`
      case 'bytes':
        return `${(val / 1024 / 1024).toFixed(1)}MB`
      default:
        return val.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {getTrendIcon()}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <p className={`text-xs ${getTrendColor()}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}% from last period
          </p>
        )}
      </div>
    </div>
  )
}