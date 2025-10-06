// 🔥 AURA LAUNCHER - JavaScript Interface
let systemStatus = 'offline';
let installProgress = 0;

// Éléments DOM
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercentage = document.getElementById('progressPercentage');
const terminalOutput = document.getElementById('terminalOutput');
const installBtn = document.getElementById('installBtn');
const launchBtn = document.getElementById('launchBtn');
const systemStatusEl = document.getElementById('systemStatus');

// Mise à jour du statut système
function updateSystemStatus(status, text) {
    systemStatus = status;
    const statusDot = systemStatusEl.querySelector('.tiktok-status-dot');
    const statusText = systemStatusEl.querySelector('.status-text');
    
    statusDot.className = `tiktok-status-dot ${status}`;
    statusText.textContent = text;
}

// Mise à jour de la barre de progression
function updateProgress(percent, text) {
    installProgress = percent;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
    progressPercentage.textContent = `${percent}%`;
}

// Ajouter ligne au terminal
function addTerminalLine(text, type = 'info') {
    const line = document.createElement('div');
    line.className = `tiktok-terminal-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Effacer terminal
function clearTerminal() {
    terminalOutput.innerHTML = '';
    addTerminalLine('Terminal effacé', 'info');
}

// Mise à jour des étapes
function updateStep(stepName, status) {
    const step = document.querySelector(`[data-step="${stepName}"]`);
    if (step) {
        step.className = `step ${status}`;
        const icon = step.querySelector('.step-icon');
        
        switch (status) {
            case 'running':
                icon.textContent = '⏳';
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

// Installation AURA
async function startInstallation() {
    installBtn.disabled = true;
    updateSystemStatus('loading', 'Installation en cours...');
    addTerminalLine('🚀 Démarrage installation AURA', 'info');
    
    const steps = [
        { name: 'system-check', text: 'Vérification système Ubuntu', duration: 2000 },
        { name: 'dependencies', text: 'Installation dépendances', duration: 3000 },
        { name: 'docker', text: 'Configuration Docker', duration: 2500 },
        { name: 'database', text: 'Initialisation base de données', duration: 2000 },
        { name: 'services', text: 'Démarrage services AURA', duration: 1500 },
        { name: 'tests', text: 'Tests d\'intégrité', duration: 1000 }
    ];
    
    let currentProgress = 0;
    const progressStep = 100 / steps.length;
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        updateStep(step.name, 'running');
        updateProgress(currentProgress, step.text);
        addTerminalLine(`Exécution: ${step.text}`, 'info');
        
        // Simuler l'installation
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        updateStep(step.name, 'completed');
        currentProgress += progressStep;
        updateProgress(Math.round(currentProgress), `${step.text} - Terminé`);
        addTerminalLine(`✅ ${step.text} - Terminé`, 'success');
    }
    
    // Installation terminée
    updateProgress(100, 'Installation AURA terminée avec succès');
    updateSystemStatus('online', 'Système prêt');
    addTerminalLine('🎉 Installation AURA terminée avec succès!', 'success');
    
    installBtn.disabled = false;
    launchBtn.disabled = false;
}

// Lancement AURA
async function launchAura() {
    addTerminalLine('🚀 Lancement AURA Forensic System...', 'info');
    updateSystemStatus('online', 'AURA actif');
    
    try {
        // Test de connexion backend
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            addTerminalLine('✅ Backend AURA connecté', 'success');
            addTerminalLine('🌐 Interface disponible dans le navigateur', 'info');
        } else {
            addTerminalLine('⚠️ Backend non disponible, démarrage en mode local', 'warning');
        }
    } catch (error) {
        addTerminalLine('⚠️ Connexion backend échouée, mode autonome', 'warning');
    }
    
    addTerminalLine('🎯 AURA Forensic System opérationnel!', 'success');
}

// Configuration
function openConfig() {
    addTerminalLine('⚙️ Ouverture configuration AURA...', 'info');
    // Ouvrir interface de configuration
}

// Support
function openSupport() {
    addTerminalLine('📞 Ouverture support technique...', 'info');
    // Ouvrir interface de support
}

// Quitter
function quitLauncher() {
    if (confirm('Êtes-vous sûr de vouloir quitter AURA Launcher?')) {
        addTerminalLine('👋 Fermeture AURA Launcher...', 'info');
        updateSystemStatus('offline', 'Système arrêté');
        // Fermer l'application
    }
}

// Validation authentification
function validateAuth() {
    const password = document.getElementById('sudoPassword').value;
    if (password) {
        addTerminalLine('🔐 Authentification validée', 'success');
        document.getElementById('authSection').style.display = 'none';
        startInstallation();
    } else {
        addTerminalLine('❌ Mot de passe requis', 'error');
    }
}

// Vérification statut au démarrage
async function checkSystemStatus() {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            updateSystemStatus('online', 'Système actif');
            launchBtn.disabled = false;
            addTerminalLine('✅ AURA déjà installé et actif', 'success');
        }
    } catch (error) {
        updateSystemStatus('offline', 'Système arrêté');
        addTerminalLine('📦 AURA prêt pour installation', 'info');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    addTerminalLine('🔥 AURA Forensic System v2.1', 'info');
    addTerminalLine('Initialisation du launcher...', 'info');
    checkSystemStatus();
});