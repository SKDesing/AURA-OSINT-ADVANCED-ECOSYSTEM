'use client';
import { useState, useEffect } from 'react';

export default function StealthSessions() {
  const [sessions, setSessions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  const startSession = async () => {
    try {
      const response = await fetch('/api/stealth/start', { method: 'POST' });
      const data = await response.json();
      setActiveSession(data.sessionId);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const stopSession = async () => {
    try {
      await fetch('/api/stealth/stop', { method: 'POST' });
      setActiveSession(null);
    } catch (error) {
      console.error('Failed to stop session:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/stealth/logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🥷 Sessions Stealth</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={startSession}
          disabled={activeSession}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          ▶️ Démarrer Session
        </button>
        <button
          onClick={stopSession}
          disabled={!activeSession}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          ⏹️ Arrêter Session
        </button>
        <button
          onClick={fetchLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-80"
        >
          📋 Charger Logs
        </button>
      </div>

      {activeSession && (
        <div className="mb-4 p-3 bg-green-800 rounded-lg">
          🟢 Session active: {activeSession}
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Logs Stealth:</h3>
        <div className="max-h-96 overflow-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm mb-1 font-mono">
              [{log.timestamp}] {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
