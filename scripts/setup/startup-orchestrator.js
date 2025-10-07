#!/usr/bin/env node
// AURA Startup Orchestrator - Workflow Optimal

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class StartupOrchestrator {
    constructor() {
        this.services = new Map();
        this.startupFile = path.join(__dirname, 'startup-wizard.html');
        this.chromiumProcess = null;
        
        // Configuration des services
        this.serviceConfig = [
            { name: 'analytics', command: ['node', 'backend/api/analytics-api.js'], port: 4002, endpoint: '/api/analytics/dashboard', critical: true },
            { name: 'gui', command: ['node', 'scripts/setup/gui-launcher.js'], port: 3000, endpoint: '/api/status', critical: true },
            { name: 'orchestrator', command: ['node', 'service-orchestrator.js'], port: 4001, endpoint: '/api/status', critical: false }
        ];
    }

    async cleanupPorts() {
        console.log('🧹 Nettoyage des ports...');
        const { exec } = require('child_process');
        
        const ports = [3000, 4001, 4002];
        for (const port of ports) {
            try {
                await new Promise((resolve) => {
                    exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, () => resolve());
                });
            } catch (error) {
                // Port déjà libre
            }
        }
        
        // Attendre que les ports se libèrent
        await new Promise(r => setTimeout(r, 2000));
        console.log('✅ Ports nettoyés');
    }

    async start() {
        console.log('🚀 AURA Startup Orchestrator - Workflow Optimal');
        
        // 0. NETTOYAGE DES PORTS
        await this.cleanupPorts();
        
        // 1. LANCEMENT IMMÉDIAT DE CHROMIUM
        this.launchChromiumWithWizard();
        
        // 2. DÉMARRAGE SERVICES BACKEND EN ARRIÈRE-PLAN
        setTimeout(() => this.startBackendServices(), 1000);
        
        console.log('✅ Workflow optimal démarré');
        console.log('🌐 Chromium ouvert sur page d\'installation');
        console.log('⚙️ Services backend démarrent en arrière-plan...');
    }

    launchChromiumWithWizard() {
        const ChromiumEnforcer = require('./chromium-enforcer');
        const os = require('os');
        
        try {
            const chromiumPath = ChromiumEnforcer.getChromiumPath();
            
            if (!fs.existsSync(this.startupFile)) {
                console.error('❌ startup-wizard.html introuvable');
                return false;
            }
            
            // Créer un profil utilisateur dédié pour AURA
            const userDataDir = path.join(os.homedir(), '.config', 'aura-chromium');
            if (!fs.existsSync(userDataDir)) {
                fs.mkdirSync(userDataDir, { recursive: true });
            }
            
            console.log('🌐 Lancement Chromium avec wizard...');
            const command = `"${chromiumPath}" "${this.startupFile}" --new-window --user-data-dir="${userDataDir}" --disable-web-security --no-sandbox --disable-features=VizDisplayCompositor`;
            
            const chromiumProcess = exec(command, (error) => {
                if (error) {
                    console.error('❌ Erreur Chromium:', error.message);
                } else {
                    console.log('✅ Chromium lancé avec succès');
                }
            });
            
            // Stocker le processus Chromium pour gestion
            this.chromiumProcess = chromiumProcess;
            
            return true;
        } catch (error) {
            console.error('❌ Échec lancement Chromium:', error.message);
            console.log('📝 Continuez manuellement sur http://localhost:3000');
            return false;
        }
    }

    async waitForService(port, endpoint = '/api/status', timeout = 15000) {
        const fetch = require('node-fetch');
        const start = Date.now();
        
        while (Date.now() - start < timeout) {
            try {
                const res = await fetch(`http://localhost:${port}${endpoint}`, { timeout: 2000 });
                if (res.ok) {
                    console.log(`✅ Service port ${port} opérationnel`);
                    return true;
                }
            } catch (error) {
                // Service pas encore prêt
            }
            await new Promise(r => setTimeout(r, 500));
        }
        
        console.error(`❌ Timeout: Service port ${port} non disponible après ${timeout}ms`);
        return false;
    }

    async startBackendServices() {
        console.log('⚙️ Démarrage services backend...');
        
        // 1. Analytics API (port 4002) - Service critique
        this.startService('analytics', ['node', 'backend/api/analytics-api.js']);
        const analyticsReady = await this.waitForService(4002, '/api/analytics/dashboard');
        
        if (analyticsReady) {
            console.log('🎯 Analytics API prêt, démarrage GUI...');
            // 2. GUI Launcher (port 3000) - Interface utilisateur
            this.startService('gui', ['node', 'scripts/setup/gui-launcher.js']);
            
            const guiReady = await this.waitForService(3000, '/api/status');
            
            if (guiReady) {
                console.log('🖥️ GUI prêt, démarrage orchestrateur...');
                // 3. Service Orchestrator (port 4001) - Services additionnels
                this.startService('orchestrator', ['node', 'service-orchestrator.js']);
            } else {
                console.error('❌ GUI non disponible, continuez manuellement');
            }
        } else {
            console.error('❌ Analytics API critique non disponible');
            console.log('🔧 Vérifiez les logs et redémarrez manuellement');
        }
    }

    startService(name, command) {
        if (this.services.has(name)) return;
        
        console.log(`🔄 Démarrage ${name}...`);
        
        const service = spawn(command[0], command.slice(1), {
            stdio: 'pipe',
            detached: false
        });
        
        service.stdout.on('data', (data) => {
            console.log(`[${name}] ${data.toString().trim()}`);
        });
        
        service.stderr.on('data', (data) => {
            console.error(`[${name}] ${data.toString().trim()}`);
        });
        
        service.on('exit', (code) => {
            console.log(`[${name}] Arrêté (code: ${code})`);
            this.services.delete(name);
        });
        
        this.services.set(name, service);
        console.log(`✅ Service ${name} démarré`);
    }

    stop() {
        console.log('🛑 Arrêt de tous les services...');
        
        // Arrêter Chromium en premier
        if (this.chromiumProcess) {
            console.log('🔄 Fermeture Chromium...');
            this.chromiumProcess.kill('SIGTERM');
        }
        
        // Arrêter tous les services backend
        for (const [name, service] of this.services) {
            console.log(`🔄 Arrêt ${name}...`);
            service.kill('SIGTERM');
            
            // Force kill après 5 secondes si nécessaire
            setTimeout(() => {
                if (!service.killed) {
                    console.log(`⚠️ Force kill ${name}`);
                    service.kill('SIGKILL');
                }
            }, 5000);
        }
        
        this.services.clear();
        console.log('✅ Tous les services arrêtés');
    }
}

// Gestion des signaux pour arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Signal d\'arrêt reçu...');
    if (global.orchestrator) {
        global.orchestrator.stop();
    }
    process.exit(0);
});

// Démarrage si appelé directement
if (require.main === module) {
    global.orchestrator = new StartupOrchestrator();
    global.orchestrator.start();
}

module.exports = StartupOrchestrator;