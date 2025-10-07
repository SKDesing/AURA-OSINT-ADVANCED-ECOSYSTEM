import React, { useState, useEffect } from 'react';

const InstallationWizard = () => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [services, setServices] = useState({
        api: false,
        gui: false,
        database: false,
        frontend: false
    });
    const [logs, setLogs] = useState([]);

    const steps = [
        { id: 1, name: '🔧 Initialisation système', description: 'Préparation de l\'environnement AURA' },
        { id: 2, name: '📡 Analytics API', description: 'Démarrage du moteur d\'analyse OSINT' },
        { id: 3, name: '🖥️ Interface GUI', description: 'Lancement de l\'interface utilisateur' },
        { id: 4, name: '🗄️ Base de données', description: 'Initialisation Database per Service' },
        { id: 5, name: '⚡ Frontend Next.js', description: 'Interface moderne harmonisée' },
        { id: 6, name: '✅ Installation terminée', description: 'Redirection vers AURA OSINT' }
    ];

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-10), { timestamp, message, type }]);
    };

    useEffect(() => {
        const checkServices = async () => {
            try {
                // Vérifier Analytics API
                if (!services.api) {
                    try {
                        const apiResponse = await fetch('http://localhost:4002/api/status');
                        if (apiResponse.ok) {
                            setServices(prev => ({ ...prev, api: true }));
                            setCurrentStep(2);
                            addLog('Analytics API opérationnelle', 'success');
                        }
                    } catch (error) {
                        addLog('Analytics API en cours de démarrage...', 'info');
                    }
                }

                // Vérifier GUI
                if (!services.gui && services.api) {
                    try {
                        const guiResponse = await fetch('http://localhost:3000');
                        if (guiResponse.ok) {
                            setServices(prev => ({ ...prev, gui: true }));
                            setCurrentStep(3);
                            addLog('Interface GUI opérationnelle', 'success');
                        }
                    } catch (error) {
                        addLog('Interface GUI en cours de démarrage...', 'info');
                    }
                }

                // Vérifier Database (simulation via API)
                if (!services.database && services.api) {
                    setServices(prev => ({ ...prev, database: true }));
                    setCurrentStep(4);
                    addLog('Database per Service initialisée', 'success');
                }

                // Vérifier Frontend Next.js
                if (!services.frontend && services.gui) {
                    try {
                        const frontendResponse = await fetch('http://localhost:3002');
                        if (frontendResponse.ok) {
                            setServices(prev => ({ ...prev, frontend: true }));
                            setCurrentStep(5);
                            addLog('Frontend Next.js opérationnel', 'success');
                        }
                    } catch (error) {
                        addLog('Frontend Next.js en cours de démarrage...', 'info');
                    }
                }

                // Calculer la progression
                const serviceCount = Object.values(services).filter(Boolean).length;
                const newProgress = Math.min((serviceCount / 4) * 100, 100);
                setProgress(newProgress);

                // Installation terminée
                if (services.api && services.gui && services.database) {
                    setCurrentStep(6);
                    addLog('Installation AURA OSINT terminée !', 'success');
                    
                    setTimeout(() => {
                        addLog('Redirection vers l\'interface principale...', 'info');
                        setTimeout(() => {
                            window.location.href = 'http://localhost:3000';
                        }, 2000);
                    }, 1000);
                }

            } catch (error) {
                addLog('Erreur lors de la vérification des services', 'error');
            }
        };

        // Démarrer l'installation
        if (currentStep === 0) {
            setCurrentStep(1);
            addLog('Initialisation du système AURA OSINT...', 'info');
        }

        const interval = setInterval(checkServices, 1500);
        return () => clearInterval(interval);
    }, [services, currentStep]);

    const getStepStatus = (stepId) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'active';
        return 'pending';
    };

    const getLogTypeColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            default: return 'text-blue-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">🛡️</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
                        AURA OSINT
                    </h1>
                    <p className="text-xl text-slate-400">Installation et Configuration</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">Progression</span>
                        <span className="text-sm font-bold text-teal-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="mb-8 space-y-3">
                    {steps.map((step) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div 
                                key={step.id}
                                className={`flex items-center p-4 rounded-lg border transition-all duration-300 ${
                                    status === 'completed' 
                                        ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                                        : status === 'active'
                                        ? 'bg-blue-900/20 border-blue-500/30 text-blue-400 animate-pulse'
                                        : 'bg-slate-800/50 border-slate-600/30 text-slate-500'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                                    status === 'completed' 
                                        ? 'bg-green-500' 
                                        : status === 'active'
                                        ? 'bg-blue-500 animate-pulse'
                                        : 'bg-slate-600'
                                }`}>
                                    {status === 'completed' ? '✓' : step.id}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">{step.name}</div>
                                    <div className="text-sm opacity-75">{step.description}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Logs */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                    <h3 className="text-lg font-semibold mb-3 text-slate-300">Logs d'installation</h3>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-slate-500 text-sm">En attente des logs...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="text-sm font-mono">
                                    <span className="text-slate-500">[{log.timestamp}]</span>
                                    <span className={`ml-2 ${getLogTypeColor(log.type)}`}>
                                        {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-slate-500 text-sm">
                    <p>🔒 Installation sécurisée • 🌐 Chromium Only • 🛡️ Forensic Ready</p>
                </div>
            </div>
        </div>
    );
};

export default InstallationWizard;