'use client';
import { useState, useEffect } from 'react';

export default function CoordinatedNetworks() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      const response = await fetch('/api/analytics/coordinated-networks');
      const data = await response.json();
      setNetworks(data.networks || []);
    } catch (error) {
      console.error('Failed to fetch networks:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🕸️ Réseaux Coordonnés</h1>
      
      {loading ? (
        <div className="text-center">⏳ Chargement des réseaux...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networks.map((network, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Réseau #{index + 1}</h3>
              <p className="text-sm text-gray-300 mb-2">
                Comptes: {network.accounts?.length || 0}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Score de coordination: {network.coordinationScore || 'N/A'}
              </p>
              <div className="text-xs text-gray-400">
                Détecté: {network.detectedAt || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
