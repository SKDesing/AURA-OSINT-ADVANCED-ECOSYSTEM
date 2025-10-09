// AURA MVP - 3 modules essentiels
import React, { useState } from 'react';
import { ObservabilityDashboard } from './modules/observability/ObservabilityDashboard';
import { RouterDecisions } from './modules/router/RouterDecisions';
import { ArtifactViewer } from './modules/artifacts/ArtifactViewer';

type ActiveModule = 'observability' | 'router' | 'artifacts';

export const AppMVP: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('observability');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                🚀 AURA OSINT MVP
              </h1>
            </div>
            
            <div className="flex space-x-4 items-center">
              <NavButton
                active={activeModule === 'observability'}
                onClick={() => setActiveModule('observability')}
              >
                📊 Observability
              </NavButton>
              <NavButton
                active={activeModule === 'router'}
                onClick={() => setActiveModule('router')}
              >
                🧠 Router Decisions
              </NavButton>
              <NavButton
                active={activeModule === 'artifacts'}
                onClick={() => setActiveModule('artifacts')}
              >
                📄 Artifacts
              </NavButton>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        {activeModule === 'observability' && <ObservabilityDashboard />}
        {activeModule === 'router' && <RouterDecisions />}
        {activeModule === 'artifacts' && <ArtifactViewer />}
      </main>
    </div>
  );
};

const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);