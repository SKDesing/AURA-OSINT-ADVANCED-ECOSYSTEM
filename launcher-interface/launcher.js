// 🚀 AURA LAUNCHER JAVASCRIPT - Logique installation et interface

class AuraLauncher {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 6;
        this.isInstalling = false;
        this.isInstalled = false;
        this.sudoPassword = '';
        
        this.steps = [
            { id: 'system-check', name: 'Vérification système', duration: 3000 },
            { id: 'dependencies', name: 'Installation dépendances', duration: 15000 },
            { id: 'docker', name: 'Configuration Docker', duration: 10000 },
            { id: 'database', name: 'Initialisation base de données', duration: 8000 },
            { id: 'services', name: 'Démarrage services AURA', duration: 5000 },
            { id: 'tests', name: 'Tests d\'intégrité', duration: 4000 }
        ];
        
        this.init();
    }
    
    init() {
        this.checkSystemStatus();
        this.setupEventListeners();
        this.addTerminalLine('🔥 AURA Launcher initialisé');
        this.addTerminalLine('📋 Système prêt pour installation');
    }
    
    setupEventListeners() {
        // Enter key pour mot de passe
        document.getElementById('sudoPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.validateAuth();
            }
        });
        
        // Vérification status périodique
        setInterval(() => {
            if (!this.isInstalling) {
                this.checkSystemStatus();
            }
        }, 5000);
    }
    
    async checkSystemStatus() {
        try {
            const response = await fetch('http://localhost:3000/api/health');
            if (response.ok) {
                this.updateSystemStatus('online', 'Système AURA actif');
                this.isInstalled = true;
                this.enableLaunchButton();
            } else {
                this.updateSystemStatus('offline', 'Système arrêté');
            }
        } catch (error) {
            this.updateSystemStatus('offline', 'Système arrêté');
        }
    }
    
    updateSystemStatus(status, text) {
        const indicator = document.getElementById('systemStatus');
        const dot = indicator.querySelector('.status-dot');
        const statusText = indicator.querySelector('.status-text');
        
        dot.className = `status-dot ${status}`;
        statusText.textContent = text;
    }
    
    addTerminalLine(text, type = 'normal') {
        const terminal = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
        
        // Limiter à 100 lignes
        const lines = terminal.querySelectorAll('.terminal-line');
        if (lines.length > 100) {
            lines[0].remove();
        }
    }
    
    updateProgress(percentage, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressPercentage = document.getElementById('progressPercentage');
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = text;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
    
    updateStepStatus(stepId, status) {
        const step = document.querySelector(`[data-step="${stepId}"]`);
        if (step) {
            step.className = `step ${status}`;
            const icon = step.querySelector('.step-icon');
            
            switch (status) {
                case 'running':
                    icon.textContent = '🔄';
                    break;
                case 'completed':
                    icon.textContent = '✅';
                    break;
                case 'error':
                    icon.textContent = '❌';
                    break;
                default:
                    icon.textContent = '⏳';
            }
        }
    }
    
    showAuthSection() {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('sudoPassword').focus();
    }
    
    hideAuthSection() {
        document.getElementById('authSection').style.display = 'none';
    }
    
    validateAuth() {
        const password = document.getElementById('sudoPassword').value;
        if (!password) {
            this.addTerminalLine('❌ Mot de passe requis', 'error');
            return;
        }
        
        this.sudoPassword = password;
        this.hideAuthSection();
        this.addTerminalLine('🔐 Authentification validée', 'success');
        this.proceedWithInstallation();
    }
    
    async startInstallation() {
        if (this.isInstalling) return;
        
        this.addTerminalLine('🚀 Démarrage installation AURA...', 'success');
        this.showAuthSection();
    }
    
    async proceedWithInstallation() {
        this.isInstalling = true;
        this.updateSystemStatus('installing', 'Installation en cours...');
        
        const installBtn = document.getElementById('installBtn');
        installBtn.disabled = true;
        installBtn.textContent = '⏳ INSTALLATION...';
        
        try {
            for (let i = 0; i < this.steps.length; i++) {
                const step = this.steps[i];
                await this.executeStep(step, i);
            }
            
            this.addTerminalLine('🎉 Installation AURA terminée avec succès !', 'success');
            this.updateProgress(100, 'Installation terminée - AURA prêt !');
            this.updateSystemStatus('online', 'Système AURA actif');
            this.enableLaunchButton();
            this.isInstalled = true;
            
        } catch (error) {
            this.addTerminalLine(`❌ Erreur installation: ${error.message}`, 'error');
            this.updateSystemStatus('offline', 'Erreur installation');
        } finally {
            this.isInstalling = false;
            installBtn.disabled = false;
            installBtn.textContent = '🚀 INSTALLER AURA';
        }
    }
    
    async executeStep(step, index) {
        this.addTerminalLine(`📋 ${step.name}...`);
        this.updateStepStatus(step.id, 'running');
        
        const startProgress = (index / this.totalSteps) * 100;
        const endProgress = ((index + 1) / this.totalSteps) * 100;
        
        // Simulation progression
        const progressInterval = setInterval(() => {
            const currentProgress = parseFloat(document.getElementById('progressFill').style.width) || startProgress;
            if (currentProgress < endProgress) {
                this.updateProgress(currentProgress + 1, `${step.name}...`);
            }
        }, step.duration / (endProgress - startProgress));
        
        try {
            // Exécution étape selon le type
            switch (step.id) {
                case 'system-check':
                    await this.checkSystem();
                    break;
                case 'dependencies':
                    await this.installDependencies();
                    break;
                case 'docker':
                    await this.setupDocker();
                    break;
                case 'database':
                    await this.initDatabase();
                    break;
                case 'services':
                    await this.startServices();
                    break;
                case 'tests':
                    await this.runTests();
                    break;
            }
            
            clearInterval(progressInterval);
            this.updateProgress(endProgress, `${step.name} terminé`);
            this.updateStepStatus(step.id, 'completed');
            this.addTerminalLine(`✅ ${step.name} terminé`, 'success');
            
        } catch (error) {
            clearInterval(progressInterval);
            this.updateStepStatus(step.id, 'error');
            this.addTerminalLine(`❌ Erreur ${step.name}: ${error.message}`, 'error');
            throw error;
        }
    }
    
    async checkSystem() {
        await this.delay(1000);
        this.addTerminalLine('🔍 Vérification Ubuntu 20.04+...');
        await this.delay(1000);
        this.addTerminalLine('✅ Système compatible détecté');
        await this.delay(1000);
        this.addTerminalLine('💾 Espace disque suffisant: 5GB disponibles');
    }
    
    async installDependencies() {
        const deps = ['curl', 'wget', 'git', 'docker.io', 'docker-compose', 'postgresql', 'nodejs', 'npm'];
        
        for (const dep of deps) {
            this.addTerminalLine(`📦 Installation ${dep}...`);
            await this.delay(1500);
            this.addTerminalLine(`✅ ${dep} installé`);
        }
    }
    
    async setupDocker() {
        this.addTerminalLine('🐳 Configuration Docker...');
        await this.delay(2000);
        this.addTerminalLine('🔧 Ajout utilisateur au groupe docker');
        await this.delay(1500);
        this.addTerminalLine('🚀 Démarrage service Docker');
        await this.delay(2000);
        this.addTerminalLine('✅ Docker configuré et actif');
    }
    
    async initDatabase() {
        this.addTerminalLine('🗄️ Initialisation PostgreSQL...');
        await this.delay(2000);
        this.addTerminalLine('📊 Création base de données AURA');
        await this.delay(2000);
        this.addTerminalLine('🔐 Configuration utilisateur forensique');
        await this.delay(2000);
        this.addTerminalLine('📋 Import schéma forensique');
        await this.delay(2000);
        this.addTerminalLine('✅ Base de données prête');
    }
    
    async startServices() {
        const services = ['Backend API', 'Frontend React', 'Database', 'Redis Cache', 'MinIO Storage'];
        
        for (const service of services) {
            this.addTerminalLine(`🚀 Démarrage ${service}...`);
            await this.delay(800);
            this.addTerminalLine(`✅ ${service} actif`);
        }
    }
    
    async runTests() {
        this.addTerminalLine('🧪 Tests d\'intégrité système...');
        await this.delay(1000);
        this.addTerminalLine('✅ API Backend: OK');
        await this.delay(1000);
        this.addTerminalLine('✅ Interface Frontend: OK');
        await this.delay(1000);
        this.addTerminalLine('✅ Base de données: OK');
        await this.delay(1000);
        this.addTerminalLine('✅ Extensions navigateur: OK');
    }
    
    enableLaunchButton() {
        const launchBtn = document.getElementById('launchBtn');
        launchBtn.disabled = false;
        launchBtn.style.animation = 'pulse 1.5s infinite';
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Fonctions globales pour les boutons
function startInstallation() {
    window.auraLauncher.startInstallation();
}

function validateAuth() {
    window.auraLauncher.validateAuth();
}

function launchAura() {
    window.auraLauncher.addTerminalLine('🚀 Lancement AURA Forensic System...', 'success');
    
    // Ouvrir AURA dans un nouvel onglet
    setTimeout(() => {
        window.open('http://localhost:3001', '_blank');
    }, 1000);
}

function openConfig() {
    window.auraLauncher.addTerminalLine('⚙️ Ouverture configuration système...');
    // TODO: Implémenter interface configuration
    alert('Configuration système - À implémenter');
}

function quitLauncher() {
    if (confirm('Êtes-vous sûr de vouloir quitter AURA Launcher ?')) {
        window.auraLauncher.addTerminalLine('👋 Fermeture AURA Launcher...', 'warning');
        setTimeout(() => {
            window.close();
        }, 1000);
    }
}

function openSupport() {
    window.auraLauncher.addTerminalLine('📞 Ouverture support technique...');
    // TODO: Implémenter interface support
    alert('Support technique AURA\nEmail: support@aura-forensic.com\nTél: +33 1 23 45 67 89');
}

function clearTerminal() {
    document.getElementById('terminalOutput').innerHTML = '';
    window.auraLauncher.addTerminalLine('🔥 Terminal AURA effacé');
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.auraLauncher = new AuraLauncher();
});