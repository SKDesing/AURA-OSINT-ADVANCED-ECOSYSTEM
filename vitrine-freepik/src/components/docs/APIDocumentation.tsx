import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  example: string;
  response: string;
}

const APIDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/analytics/dashboard',
      description: 'Récupère les statistiques analytics en temps réel',
      example: 'curl http://localhost:4002/api/analytics/dashboard',
      response: '{"totalAnalyses": 15847, "activeProfiles": 342, "successRate": 94.7}'
    },
    {
      method: 'POST',
      path: '/api/analytics/search',
      description: 'Recherche cross-platform OSINT',
      example: 'curl -X POST -d \'{"query": "username", "platforms": ["tiktok"]}\' http://localhost:4002/api/analytics/search',
      response: '{"matches": [], "correlation_score": 0.95, "evidence_hash": "sha256:abc123"}'
    },
    {
      method: 'GET',
      path: '/api/system/health',
      description: 'Status et santé des services système',
      example: 'curl http://localhost:3000/api/system/health',
      response: '{"status": "healthy", "services": {}, "uptime": 3600}'
    },
    {
      method: 'POST',
      path: '/api/reports/export',
      description: 'Export forensique avec chain of custody',
      example: 'curl -X POST -d \'{"format": "pdf", "includeEvidence": true}\' http://localhost:3000/api/reports/export',
      response: '{"reportId": "RPT-123", "downloadUrl": "/download/123", "evidenceHash": "sha256:def456"}'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Documentation API</h3>
      
      <div className="space-y-3">
        {endpoints.map((endpoint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedEndpoint(selectedEndpoint === endpoint.path ? null : endpoint.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-gray-700">{endpoint.path}</code>
                </div>
                <div className="text-gray-400">
                  {selectedEndpoint === endpoint.path ? '−' : '+'}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
            </div>
            
            {selectedEndpoint === endpoint.path && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-gray-200 bg-gray-50"
              >
                <div className="p-4 space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Exemple</h5>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                      {endpoint.example}
                    </pre>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Réponse</h5>
                    <pre className="bg-gray-100 text-gray-800 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(JSON.parse(endpoint.response), null, 2)}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">🔗 Intégration</h4>
        <p className="text-sm text-blue-800">
          Tous les endpoints sont accessibles via le GUI launcher sur <code>localhost:3000</code> 
          avec proxy automatique vers les services backend.
        </p>
      </div>
    </div>
  );
};

export default APIDocumentation;