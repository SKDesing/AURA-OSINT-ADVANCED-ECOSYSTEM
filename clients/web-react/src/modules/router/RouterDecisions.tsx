// Router Decisions - Table + Drawer
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';

interface RouterDecision {
  id: string;
  timestamp: string;
  sim_semantic: number;
  sim_keywords: number;
  confidence: number;
  decision: 'rag_llm' | 'bypass' | 'cache';
  features_hash: string;
  query_preview: string;
}

export const RouterDecisions: React.FC = () => {
  const [decisions, setDecisions] = useState<RouterDecision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<RouterDecision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDecisions = async () => {
      try {
        const data = await apiClient.request<RouterDecision[]>('/ai/router/decisions?limit=50');
        setDecisions(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load router decisions:', error);
        setLoading(false);
      }
    };

    loadDecisions();
    const interval = setInterval(loadDecisions, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="animate-pulse">Loading decisions...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Router Decisions</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Query</th>
              <th className="px-4 py-2 text-left">Decision</th>
              <th className="px-4 py-2 text-left">Confidence</th>
              <th className="px-4 py-2 text-left">Sim Semantic</th>
            </tr>
          </thead>
          <tbody>
            {decisions.map((decision) => (
              <tr 
                key={decision.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedDecision(decision)}
              >
                <td className="px-4 py-2 text-sm">
                  {new Date(decision.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-xs">
                  {decision.query_preview}
                </td>
                <td className="px-4 py-2">
                  <DecisionBadge decision={decision.decision} />
                </td>
                <td className="px-4 py-2 text-sm">
                  {(decision.confidence * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-sm">
                  {decision.sim_semantic.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDecision && (
        <DecisionDrawer 
          decision={selectedDecision} 
          onClose={() => setSelectedDecision(null)} 
        />
      )}
    </div>
  );
};

const DecisionBadge: React.FC<{ decision: string }> = ({ decision }) => {
  const colors = {
    rag_llm: 'bg-blue-100 text-blue-800',
    bypass: 'bg-green-100 text-green-800',
    cache: 'bg-yellow-100 text-yellow-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[decision as keyof typeof colors]}`}>
      {decision}
    </span>
  );
};

const DecisionDrawer: React.FC<{
  decision: RouterDecision;
  onClose: () => void;
}> = ({ decision, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Decision Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Decision</label>
          <DecisionBadge decision={decision.decision} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</label>
          <div className="text-lg font-mono">{(decision.confidence * 100).toFixed(2)}%</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Similarities</label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Semantic: {decision.sim_semantic.toFixed(3)}</div>
            <div>Keywords: {decision.sim_keywords.toFixed(3)}</div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features Hash</label>
          <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
            {decision.features_hash}
          </code>
        </div>
      </div>
    </div>
  </div>
);