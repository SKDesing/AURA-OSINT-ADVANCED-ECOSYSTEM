'use client';
import { useState, useEffect } from 'react';

export default function SystemHealth() {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const endpoints = [
        { name: 'Analytics API', url: '/api/status' },
        { name: 'Stealth API', url: '/api/stealth/status' },
        { name: 'Forensic Gateway', url: '/api/forensic/status' }
      ];

      const results = {};
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url);
          results[endpoint.name] = {
            status: response.ok ? 'UP' : 'DOWN',
            responseTime: Date.now(),
            data: await response.json()
          };
        } catch (error) {
          results[endpoint.name] = {
            status: 'DOWN',
            error: error.message
          };
        }
      }
      setServices(results);
    } catch (error) {
      console.error('Health check failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏥 Santé Système</h1>
      
      {loading ? (
        <div className="text-center">⏳ Vérification des services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(services).map(([name, service]) => (
            <div key={name} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  service.status === 'UP' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {service.status}
                </span>
              </div>
              {service.data && (
                <div className="text-xs text-gray-400">
                  <pre>{JSON.stringify(service.data, null, 2)}</pre>
                </div>
              )}
              {service.error && (
                <div className="text-xs text-red-400">
                  Error: {service.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
