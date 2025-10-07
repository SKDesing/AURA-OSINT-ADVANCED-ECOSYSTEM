import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: string;
  result: string;
  endpoint: string;
}

const InteractiveDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: '1',
      title: 'Collecte OSINT',
      description: 'Extraction automatisée des profils cross-platform',
      action: 'Rechercher @target_username',
      result: '3 profils trouvés (TikTok, Instagram, Twitter)',
      endpoint: '/api/analytics/search'
    },
    {
      id: '2', 
      title: 'Corrélation IA',
      description: 'Analyse NLP + Graph matching des identités',
      action: 'Analyser similarités',
      result: 'Score de corrélation: 94.7% (Haute confiance)',
      endpoint: '/api/analytics/correlate'
    },
    {
      id: '3',
      title: 'Export Forensique',
      description: 'Génération rapport ISO/IEC 27037:2012',
      action: 'Exporter preuves',
      result: 'Rapport PDF + SHA-256 généré',
      endpoint: '/api/reports/export'
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsRunning(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Démo Interactive AURA</h3>
        <button
          onClick={runDemo}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg font-medium ${
            isRunning 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Démo en cours...' : 'Lancer Démo'}
        </button>
      </div>

      <div className="space-y-4">
        {demoSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: isRunning && index === currentStep ? 1 : 0.5,
              scale: isRunning && index === currentStep ? 1.02 : 1
            }}
            className={`p-4 rounded-lg border-2 ${
              isRunning && index === currentStep 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{step.title}</h4>
              <div className="flex items-center space-x-2">
                {isRunning && index === currentStep && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                <span className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                  {step.endpoint}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
            
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Action: </span>
                <span className="text-gray-600">{step.action}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Résultat: </span>
                <span className="text-gray-600">{step.result}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-900">
                Étape {currentStep + 1}/3 - {demoSteps[currentStep]?.title}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveDemo;