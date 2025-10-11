/**
 * 🎯 AURA OSINT - Système de Démonstration des Alertes
 * Démonstrations interactives de toutes les alertes SweetAlert2
 * Interface de test pour l'équipe frontend
 */

import AuraAlerts from './sweetalert-aura-config.js';
import AuraAlertsComplete from './aura-alerts-complete.js';

class AuraAlertsDemo {
    constructor() {
        this.alerts = new AuraAlerts();
        this.alertsComplete = new AuraAlertsComplete();
        this.demoData = this.generateDemoData();
        this.init();
    }

    init() {
        this.createDemoInterface();
        this.attachEventListeners();
        this.createFloatingDemoButton();
    }

    generateDemoData() {
        return {
            investigation: {
                targetName: 'John Doe',
                profilesFound: 12,
                connectionsFound: 47,
                dataPoints: 156,
                riskLevel: 'Moyen',
                duration: '00:15:32'
            },
            error: {
                message: 'Connexion à l\'API Shodan impossible',
                code: 'SHODAN_API_ERROR_401',
                stack: 'Error: Unauthorized access\n    at ShodanAPI.connect()\n    at OSINTOrchestrator.runTool()'
            },
            tools: [
                'LinkedIn Scanner', 'Twitter Analyzer', 'Email Hunter', 
                'Shodan Scanner', 'Whois Lookup', 'DNS Analyzer'
            ]
        };
    }

    createDemoInterface() {
        const demoContainer = document.createElement('div');
        demoContainer.id = 'aura-alerts-demo';
        demoContainer.innerHTML = `
            <div class="demo-header">
                <h2>🎯 AURA OSINT - Démonstration des Alertes</h2>
                <p>Interface de test pour toutes les alertes SweetAlert2 de l'écosystème</p>
            </div>
            
            <div class="demo-categories">
                <div class="demo-category">
                    <h3>🚀 Alertes d'Investigation</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn" data-demo="startInvestigation">
                            🎯 Démarrer Investigation
                        </button>
                        <button class="demo-btn" data-demo="showProgress">
                            📊 Progression
                        </button>
                        <button class="demo-btn" data-demo="investigationComplete">
                            ✅ Investigation Terminée
                        </button>
                        <button class="demo-btn" data-demo="generatePDFReport">
                            📄 Générer Rapport PDF
                        </button>
                    </div>
                </div>

                <div class="demo-category">
                    <h3>🔐 Authentification & Sécurité</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn" data-demo="authenticate">
                            🔐 Authentification
                        </button>
                        <button class="demo-btn" data-demo="systemError">
                            ⚠️ Erreur Système
                        </button>
                        <button class="demo-btn" data-demo="systemConfiguration">
                            ⚙️ Configuration
                        </button>
                    </div>
                </div>

                <div class="demo-category">
                    <h3>🛠️ Outils & Assistant</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn" data-demo="selectOSINTTools">
                            🛠️ Sélection Outils
                        </button>
                        <button class="demo-btn" data-demo="aiAssistant">
                            🤖 Assistant IA
                        </button>
                        <button class="demo-btn" data-demo="exportData">
                            📊 Export Données
                        </button>
                    </div>
                </div>

                <div class="demo-category">
                    <h3>📱 Interface & Support</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn" data-demo="contactSupport">
                            📞 Contact Support
                        </button>
                        <button class="demo-btn" data-demo="notificationCenter">
                            🔔 Notifications
                        </button>
                        <button class="demo-btn" data-demo="themeSelector">
                            🎨 Sélecteur Thème
                        </button>
                        <button class="demo-btn" data-demo="languageSelector">
                            🌍 Langues
                        </button>
                    </div>
                </div>

                <div class="demo-category">
                    <h3>📊 Système & Maintenance</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn" data-demo="systemStats">
                            📈 Statistiques
                        </button>
                        <button class="demo-btn" data-demo="updateManager">
                            🔄 Mises à jour
                        </button>
                        <button class="demo-btn" data-demo="templateManager">
                            📋 Templates
                        </button>
                        <button class="demo-btn" data-demo="helpAssistant">
                            🎓 Aide
                        </button>
                    </div>
                </div>

                <div class="demo-category">
                    <h3>🎬 Démonstrations Avancées</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn" data-demo="showLoadingSteps">
                            🔄 Chargement Étapes
                        </button>
                        <button class="demo-btn" data-demo="advancedConfiguration">
                            🔧 Config Avancée
                        </button>
                        <button class="demo-btn" data-demo="fullWorkflowDemo">
                            🎭 Workflow Complet
                        </button>
                        <button class="demo-btn" data-demo="stressTest">
                            ⚡ Test de Stress
                        </button>
                    </div>
                </div>
            </div>

            <div class="demo-footer">
                <div class="demo-stats">
                    <span>📊 <span id="demo-count">0</span> démonstrations lancées</span>
                    <span>⏱️ Dernière: <span id="last-demo">Aucune</span></span>
                </div>
                <div class="demo-actions">
                    <button class="demo-btn-secondary" id="reset-demos">
                        🔄 Reset Compteurs
                    </button>
                    <button class="demo-btn-secondary" id="export-demo-log">
                        📤 Export Log
                    </button>
                </div>
            </div>
        `;

        // Injecter dans le DOM
        document.body.appendChild(demoContainer);
    }

    createFloatingDemoButton() {
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'floating-demo-btn';
        floatingBtn.innerHTML = '🎭';
        floatingBtn.title = 'Ouvrir les démonstrations d\'alertes';
        floatingBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #C9A96E, #CD7F32);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.transform = 'scale(1.1)';
            floatingBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        });

        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.transform = 'scale(1)';
            floatingBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        floatingBtn.addEventListener('click', () => {
            this.toggleDemoInterface();
        });

        document.body.appendChild(floatingBtn);
    }

    toggleDemoInterface() {
        const demoContainer = document.getElementById('aura-alerts-demo');
        if (demoContainer.style.display === 'none' || !demoContainer.style.display) {
            demoContainer.style.display = 'block';
            demoContainer.style.animation = 'slideInUp 0.5s ease-out';
        } else {
            demoContainer.style.animation = 'slideOutDown 0.5s ease-out';
            setTimeout(() => {
                demoContainer.style.display = 'none';
            }, 500);
        }
    }

    attachEventListeners() {
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('demo-btn')) {
                const demoType = e.target.getAttribute('data-demo');
                await this.runDemo(demoType);
                this.updateDemoStats(demoType);
            }

            if (e.target.id === 'reset-demos') {
                this.resetDemoStats();
            }

            if (e.target.id === 'export-demo-log') {
                this.exportDemoLog();
            }
        });
    }

    async runDemo(demoType) {
        try {
            switch (demoType) {
                case 'startInvestigation':
                    await this.alerts.startInvestigation(this.demoData.investigation.targetName);
                    break;

                case 'showProgress':
                    await this.alerts.showProgress(2, 4, 'LinkedIn Scanner', 65);
                    break;

                case 'investigationComplete':
                    await this.alerts.investigationComplete(this.demoData.investigation);
                    break;

                case 'generatePDFReport':
                    await this.alerts.generatePDFReport({});
                    break;

                case 'authenticate':
                    await this.alerts.authenticate();
                    break;

                case 'systemError':
                    await this.alerts.systemError(this.demoData.error);
                    break;

                case 'systemConfiguration':
                    await this.alerts.systemConfiguration();
                    break;

                case 'selectOSINTTools':
                    await this.alerts.selectOSINTTools();
                    break;

                case 'aiAssistant':
                    await this.alerts.aiAssistant('Comment analyser les connexions LinkedIn ?');
                    break;

                case 'exportData':
                    await this.alerts.exportData(['profiles', 'connections', 'timeline']);
                    break;

                case 'contactSupport':
                    await this.alertsComplete.contactSupport();
                    break;

                case 'notificationCenter':
                    await this.alertsComplete.notificationCenter();
                    break;

                case 'themeSelector':
                    await this.alertsComplete.themeSelector();
                    break;

                case 'languageSelector':
                    await this.alertsComplete.languageSelector();
                    break;

                case 'systemStats':
                    await this.alertsComplete.systemStats();
                    break;

                case 'updateManager':
                    await this.alertsComplete.updateManager();
                    break;

                case 'templateManager':
                    await this.alertsComplete.templateManager();
                    break;

                case 'helpAssistant':
                    await this.alertsComplete.helpAssistant();
                    break;

                case 'showLoadingSteps':
                    await this.alertsComplete.showLoadingSteps();
                    break;

                case 'advancedConfiguration':
                    await this.alertsComplete.advancedConfiguration();
                    break;

                case 'fullWorkflowDemo':
                    await this.runFullWorkflowDemo();
                    break;

                case 'stressTest':
                    await this.runStressTest();
                    break;

                default:
                    console.warn(`Démonstration "${demoType}" non trouvée`);
            }
        } catch (error) {
            console.error('Erreur lors de la démonstration:', error);
            await this.alerts.systemError({
                message: `Erreur dans la démonstration: ${error.message}`,
                code: 'DEMO_ERROR',
                stack: error.stack
            });
        }
    }

    async runFullWorkflowDemo() {
        // Démonstration complète d'un workflow d'investigation
        const steps = [
            () => this.alerts.startInvestigation('Demo Target'),
            () => this.alerts.selectOSINTTools(),
            () => this.alertsComplete.showLoadingSteps(),
            () => this.alerts.showProgress(3, 4, 'Final Analysis', 85),
            () => this.alerts.investigationComplete(this.demoData.investigation),
            () => this.alerts.generatePDFReport({})
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await steps[i]();
        }
    }

    async runStressTest() {
        // Test de stress avec plusieurs alertes rapides
        const stressAlerts = [
            'startInvestigation',
            'showProgress', 
            'systemError',
            'notificationCenter',
            'investigationComplete'
        ];

        for (let i = 0; i < 5; i++) {
            const randomAlert = stressAlerts[Math.floor(Math.random() * stressAlerts.length)];
            setTimeout(() => this.runDemo(randomAlert), i * 500);
        }
    }

    updateDemoStats(demoType) {
        const countElement = document.getElementById('demo-count');
        const lastDemoElement = document.getElementById('last-demo');
        
        if (countElement && lastDemoElement) {
            const currentCount = parseInt(countElement.textContent) + 1;
            countElement.textContent = currentCount;
            lastDemoElement.textContent = `${demoType} (${new Date().toLocaleTimeString()})`;
        }

        // Stocker dans localStorage
        const demoLog = JSON.parse(localStorage.getItem('aura-demo-log') || '[]');
        demoLog.push({
            type: demoType,
            timestamp: new Date().toISOString(),
            count: parseInt(countElement?.textContent || '0')
        });
        localStorage.setItem('aura-demo-log', JSON.stringify(demoLog));
    }

    resetDemoStats() {
        document.getElementById('demo-count').textContent = '0';
        document.getElementById('last-demo').textContent = 'Aucune';
        localStorage.removeItem('aura-demo-log');
    }

    exportDemoLog() {
        const demoLog = JSON.parse(localStorage.getItem('aura-demo-log') || '[]');
        const dataStr = JSON.stringify(demoLog, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aura-demo-log-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// 🎨 CSS pour l'interface de démonstration
const demoStyles = `
<style>
#aura-alerts-demo {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(44, 62, 80, 0.95);
    z-index: 10000;
    overflow-y: auto;
    padding: 20px;
    display: none;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.demo-header {
    text-align: center;
    color: white;
    margin-bottom: 30px;
}

.demo-header h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #C9A96E;
}

.demo-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    max-width: 1400px;
    margin: 0 auto;
}

.demo-category {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.demo-category h3 {
    color: #2C3E50;
    margin-bottom: 15px;
    font-size: 1.2rem;
    border-bottom: 2px solid #C9A96E;
    padding-bottom: 8px;
}

.demo-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
}

.demo-btn {
    padding: 12px 16px;
    background: linear-gradient(135deg, #C9A96E, #CD7F32);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    text-align: left;
}

.demo-btn:hover {
    background: linear-gradient(135deg, #8B7355, #B87333);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.demo-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #2C3E50;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #C9A96E;
}

.demo-stats span {
    margin-right: 20px;
    font-size: 0.9rem;
}

.demo-btn-secondary {
    padding: 8px 16px;
    background: #34495e;
    color: white;
    border: 1px solid #C9A96E;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-left: 10px;
    transition: all 0.3s ease;
}

.demo-btn-secondary:hover {
    background: #C9A96E;
    color: #2C3E50;
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideOutDown {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(100%);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .demo-categories {
        grid-template-columns: 1fr;
    }
    
    .demo-buttons {
        grid-template-columns: 1fr;
    }
    
    .demo-footer {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', demoStyles);

// 🚀 Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.AuraAlertsDemo = new AuraAlertsDemo();
    console.log('🎭 AURA Alerts Demo System initialized');
});

// 🌟 Export pour modules ES6
export default AuraAlertsDemo;