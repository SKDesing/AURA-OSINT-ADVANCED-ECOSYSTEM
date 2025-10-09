import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Zap, 
  GitBranch, 
  Search, 
  Shield, 
  Clock, 
  Users, 
  Settings 
} from 'lucide-react'

interface AppShellProps {
  children: ReactNode
}

const navigation = [
  { name: 'Observability', href: '/observability', icon: BarChart3 },
  { name: 'AI Efficiency', href: '/efficiency', icon: Zap },
  { name: 'Router', href: '/router', icon: GitBranch },
  { name: 'RAG Explorer', href: '/rag', icon: Search },
  { name: 'Guardrails', href: '/guardrails', icon: Shield },
  { name: 'Forensic', href: '/forensic', icon: Clock },
  { name: 'Entities', href: '/entities', icon: Users },
  { name: 'Admin', href: '/admin', icon: Settings }
]

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">AURA OSINT</h1>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}