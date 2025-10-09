import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/shared/layout/AppShell'
import { ObservabilityDashboard } from '@/modules/observability/ObservabilityDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2
    }
  }
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<ObservabilityDashboard />} />
            <Route path="/observability" element={<ObservabilityDashboard />} />
            <Route path="/efficiency" element={<div>AI Efficiency</div>} />
            <Route path="/router" element={<div>Router Decisions</div>} />
            <Route path="/rag" element={<div>RAG Explorer</div>} />
            <Route path="/guardrails" element={<div>Guardrails</div>} />
            <Route path="/forensic" element={<div>Forensic Timeline</div>} />
            <Route path="/entities" element={<div>Entity Intelligence</div>} />
            <Route path="/admin" element={<div>Admin Settings</div>} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  )
}