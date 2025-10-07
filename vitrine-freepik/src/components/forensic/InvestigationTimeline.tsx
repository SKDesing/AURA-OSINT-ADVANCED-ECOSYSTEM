import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimelineStep {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'completed' | 'in-progress' | 'pending';
  evidence?: string;
}

const InvestigationTimeline: React.FC = () => {
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Simulation d'une enquête OSINT en cours
    const mockSteps: TimelineStep[] = [
      {
        id: '1',
        timestamp: '2024-01-15T09:00:00Z',
        action: 'Collecte OSINT initiale',
        details: 'Extraction profils TikTok, Instagram, Twitter',
        status: 'completed',
        evidence: 'SHA-256: a1b2c3d4...'
      },
      {
        id: '2',
        timestamp: '2024-01-15T09:15:00Z',
        action: 'Corrélation IA',
        details: 'Analyse NLP + Graph matching (score: 0.94)',
        status: 'completed',
        evidence: 'SHA-256: e5f6g7h8...'
      },
      {
        id: '3',
        timestamp: '2024-01-15T09:30:00Z',
        action: 'Analyse réseau social',
        details: 'Mapping connexions et interactions',
        status: 'in-progress'
      },
      {
        id: '4',
        timestamp: '2024-01-15T09:45:00Z',
        action: 'Export forensique',
        details: 'Génération rapport ISO/IEC 27037:2012',
        status: 'pending'
      }
    ];

    setSteps(mockSteps);
    
    // Simulation temps réel
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500 animate-pulse';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '⟳';
      case 'pending': return '○';
      default: return '○';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Timeline d'Investigation
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">
            {isLive ? 'En cours' : 'Pause'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${getStatusColor(step.status)} flex items-center justify-center text-white text-sm font-bold`}>
                {getStatusIcon(step.status)}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
              )}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{step.action}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{step.details}</p>
              {step.evidence && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-700">
                  Evidence: {step.evidence}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded animate-pulse"></div>
          <span className="text-sm font-medium text-blue-900">
            Investigation en cours - Conformité ISO/IEC 27037:2012
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestigationTimeline;