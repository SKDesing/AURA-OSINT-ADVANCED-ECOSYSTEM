import { useEffect, useRef, useState } from 'react'

interface SSEOptions {
  reconnect?: boolean
  maxRetries?: number
  retryDelay?: number
}

export function useSSE<T = unknown>(
  url: string, 
  options: SSEOptions = {}
) {
  const { reconnect = true, maxRetries = 5, retryDelay = 1000 } = options
  const [data, setData] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const retriesRef = useRef(0)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const connect = () => {
      try {
        const eventSource = new EventSource(url)
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
          setIsConnected(true)
          setError(null)
          retriesRef.current = 0
        }

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data)
            setData(parsed)
          } catch (e) {
            console.error('SSE parse error:', e)
          }
        }

        eventSource.onerror = () => {
          setIsConnected(false)
          eventSource.close()

          if (reconnect && retriesRef.current < maxRetries) {
            retriesRef.current++
            const delay = retryDelay * Math.pow(2, retriesRef.current - 1)
            setTimeout(connect, delay)
          } else {
            setError('Connection failed')
          }
        }
      } catch (e) {
        setError('Failed to connect')
      }
    }

    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [url, reconnect, maxRetries, retryDelay])

  return { data, isConnected, error }
}