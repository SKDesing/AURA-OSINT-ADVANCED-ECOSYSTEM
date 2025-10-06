'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { 
  Menu, 
  X, 
  Home, 
  Play, 
  Search, 
  FileText, 
  Settings, 
  Zap,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'TikTok Live', href: '/tiktok', icon: Play },
  { name: 'Dorks OSINT', href: '/dorks', icon: Search },
  { name: 'Rapports', href: '/reports', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-soft flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AURA</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-soft hover:bg-gray-100 hover:text-gray-900 transition-colors group"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Utilisateur
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Mode Débutant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700">Accueil</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Dashboard</span>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Mode Pro
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}