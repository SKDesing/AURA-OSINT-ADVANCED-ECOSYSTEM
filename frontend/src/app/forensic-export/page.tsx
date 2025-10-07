'use client';
import { useState } from 'react';

export default function ForensicExport() {
  const [exportData, setExportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/forensic-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, includeChainOfCustody: true })
      });
      const data = await response.json();
      setExportData(data);
    } catch (error) {
      console.error('Export failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔐 Export Forensique</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button 
          onClick={() => handleExport('pdf')}
          className="bg-primary text-white p-4 rounded-lg hover:opacity-80"
          disabled={loading}
        >
          📄 Export PDF
        </button>
        <button 
          onClick={() => handleExport('json')}
          className="bg-accent text-white p-4 rounded-lg hover:opacity-80"
          disabled={loading}
        >
          📊 Export JSON
        </button>
        <button 
          onClick={() => handleExport('xml')}
          className="bg-gray-600 text-white p-4 rounded-lg hover:opacity-80"
          disabled={loading}
        >
          📋 Export XML
        </button>
      </div>

      {loading && <div className="text-center">⏳ Export en cours...</div>}
      
      {exportData && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Résultat Export:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(exportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
