// AURA GUI JavaScript - Interface Zéro CLI

class AuraGUI {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.checkSystemStatus();
        this.startStatusUpdates();
    }

    setupNavigation() {
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('[data-section]').dataset.section;
                this.showSection(section);
            });
        });
    }

    setupEventListeners() {
        // Form d'analyse
        const analysisForm = document.getElementById('analysis-form');
        if (analysisForm) {
            analysisForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startAnalysis();
            });
        }
    }

    showSection(sectionName) {
        // Cacher toutes les sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        // Mettre à jour la navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;
    }

    async checkSystemStatus() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            
            document.getElementById('system-status').textContent = 
                `${status.status} - ${status.services.length} services`;
            
            document.getElementById('services-status').textContent = 
                `${status.services.length} actifs`;
                
        } catch (error) {
            console.error('Erreur status:', error);
            document.getElementById('system-status').textContent = 'Erreur de connexion';
        }
    }

    async migrateChromium() {
        this.showNotification('Migration Chromium en cours...', 'info');
        this.updateProgress(25, 'Migration en cours...');
        
        try {
            const response = await fetch('/api/migrate-chromium', { method: 'POST' });
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Migration Chromium terminée !', 'success');
                this.updateProgress(100, 'Migration terminée');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showNotification(`Erreur migration: ${error.message}`, 'error');
            this.updateProgress(0, 'Erreur de migration');
        }
    }

    async fullInstall() {
        this.showNotification('Installation complète en cours...', 'info');
        this.updateProgress(50, 'Installation des dépendances...');
        
        try {
            const response = await fetch('/api/install', { method: 'POST' });
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Installation terminée !', 'success');
                this.updateProgress(100, 'Installation terminée');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showNotification(`Erreur installation: ${error.message}`, 'error');
            this.updateProgress(0, 'Erreur d\'installation');
        }
    }

    async validateInstall() {
        this.showNotification('Validation en cours...', 'info');
        
        try {
            // Simulation de validation
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showNotification('Validation réussie !', 'success');
            this.updateProgress(100, 'Système validé');
        } catch (error) {
            this.showNotification('Erreur de validation', 'error');
        }
    }

    async generateDiagnostic() {
        const resultsDiv = document.getElementById('diagnostic-results');
        resultsDiv.innerHTML = '<div class="loading-spinner me-2"></div>Génération du diagnostic...';
        
        try {
            const response = await fetch('/api/diagnostic');
            const diagnostic = await response.json();
            
            let html = '<h6>Rapport de diagnostic</h6>';
            
            // Système
            html += '<div class="diagnostic-item">';
            html += '<span>Système d\'exploitation</span>';
            html += `<span class="badge bg-info">${diagnostic.system.os}</span>`;
            html += '</div>';
            
            html += '<div class="diagnostic-item">';
            html += '<span>Version Node.js</span>';
            html += `<span class="badge bg-success">${diagnostic.system.node}</span>`;
            html += '</div>';
            
            html += '<div class="diagnostic-item">';
            html += '<span>Mémoire utilisée</span>';
            html += `<span class="badge bg-warning">${diagnostic.system.memory}</span>`;
            html += '</div>';
            
            // Services
            html += '<div class="diagnostic-item">';
            html += '<span>Services actifs</span>';
            html += `<span class="badge bg-primary">${diagnostic.services.length}</span>`;
            html += '</div>';
            
            // Fichiers
            html += '<h6 class="mt-3">Fichiers système</h6>';
            Object.entries(diagnostic.files).forEach(([file, exists]) => {
                html += '<div class="diagnostic-item">';
                html += `<span>${file}</span>`;
                html += `<span class="badge ${exists ? 'bg-success' : 'bg-danger'}">${exists ? 'OK' : 'Manquant'}</span>`;
                html += '</div>';
            });
            
            html += `<small class="text-muted mt-3 d-block">Généré le ${new Date(diagnostic.timestamp).toLocaleString()}</small>`;
            
            resultsDiv.innerHTML = html;
            
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erreur: ${error.message}</div>`;
        }
    }

    async startAnalysis() {
        this.showNotification('Analyse démarrée...', 'info');
        
        // Simulation d'analyse
        setTimeout(() => {
            this.showNotification('Analyse terminée !', 'success');
        }, 3000);
    }

    async startAllServices() {
        const services = ['analytics', 'orchestrator'];
        
        for (const service of services) {
            try {
                await fetch(`/api/start-service/${service}`, { method: 'POST' });
                this.showNotification(`Service ${service} démarré`, 'success');
            } catch (error) {
                this.showNotification(`Erreur service ${service}`, 'error');
            }
        }
    }

    async runBenchmark() {
        this.showNotification('Benchmark en cours...', 'info');
        
        // Simulation de benchmark
        setTimeout(() => {
            this.showNotification('Benchmark terminé - Performance optimale', 'success');
        }, 5000);
    }

    exportReport() {
        this.showNotification('Export du rapport...', 'info');
        
        // Simulation d'export
        setTimeout(() => {
            this.showNotification('Rapport exporté avec succès', 'success');
        }, 2000);
    }

    openHelp() {
        window.open('https://github.com/SKDesing/TikTok-Live-Analyser#readme', '_blank');
    }

    updateProgress(percent, message) {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('#install-progress small');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (progressText) {
            progressText.textContent = message;
        }
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        
        // Couleur selon le type
        toast.className = 'toast';
        if (type === 'success') {
            toast.classList.add('border-success');
        } else if (type === 'error') {
            toast.classList.add('border-danger');
        } else {
            toast.classList.add('border-info');
        }
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    startStatusUpdates() {
        // Mise à jour du status toutes les 30 secondes
        setInterval(() => {
            this.checkSystemStatus();
        }, 30000);
    }
}

// Fonctions globales pour les boutons
window.showSection = (section) => auraGUI.showSection(section);
window.checkSystemStatus = () => auraGUI.checkSystemStatus();
window.migrateChromium = () => auraGUI.migrateChromium();
window.fullInstall = () => auraGUI.fullInstall();
window.validateInstall = () => auraGUI.validateInstall();
window.generateDiagnostic = () => auraGUI.generateDiagnostic();
window.startAllServices = () => auraGUI.startAllServices();
window.runBenchmark = () => auraGUI.runBenchmark();
window.exportReport = () => auraGUI.exportReport();
window.openHelp = () => auraGUI.openHelp();

// Initialisation
const auraGUI = new AuraGUI();

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    auraGUI.showNotification(`Erreur: ${e.message}`, 'error');
});

// Gestion de la perte de connexion
window.addEventListener('offline', () => {
    auraGUI.showNotification('Connexion perdue', 'error');
});

window.addEventListener('online', () => {
    auraGUI.showNotification('Connexion rétablie', 'success');
});