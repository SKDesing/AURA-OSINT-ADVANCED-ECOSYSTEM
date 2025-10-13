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
        
        // Libérer les ports spécifiques sans tuer le processus actuel
        const ports = [3000, 4001, 4002];
        for (const port of ports) {
            await new Promise((resolve) => {
                exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, () => resolve());
            });
        }
        
        // Attendre que les ports se libèrent
        await new Promise(r => setTimeout(r, 1000));
        console.log('✅ Ports nettoyés');
    }

    async start() {
        console.log('🚀 AURA Startup Orchestrator - Workflow Optimal');
        
        // 0. NETTOYAGE DES PORTS
        await this.cleanupPorts();
        
        // 1. DÉMARRAGE SERVICES BACKEND D'ABORD
        this.startBackendServices();
        
        // 2. ATTENDRE QUE GUI SOIT PRÊT PUIS LANCER CHROMIUM
        setTimeout(async () => {
            const guiReady = await this.waitForService(3000, '/api/status', 10000);
            if (guiReady) {
                this.launchChromiumWithUrl('http://localhost:3000');
            }
        }, 3000);
        
        console.log('✅ Workflow optimal démarré');
        console.log('⚙️ Services backend démarrent...');
        console.log('🌐 Chromium s\'ouvrira sur http://localhost:3000');
    }

    launchChromiumWithUrl(url) {
        const os = require('os');
        
        // Chemins Chrome/Chromium possibles
        const chromePaths = [
            '/usr/bin/chromium-browser',  // Priorité système
            '/snap/bin/chromium',
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable'
        ];
        
        let chromiumPath = null;
        for (const testPath of chromePaths) {
            if (fs.existsSync(testPath)) {
                chromiumPath = testPath;
                break;
            }
        }
        
        if (!chromiumPath) {
            console.error('❌ Chrome/Chromium non trouvé!');
            console.log(`📝 Ouvrez manuellement: ${url}`);
            return false;
        }
        
        try {
            // Créer un profil utilisateur dédié pour AURA
            const userDataDir = path.join(os.homedir(), '.config', 'aura-chromium');
            if (!fs.existsSync(userDataDir)) {
                fs.mkdirSync(userDataDir, { recursive: true });
            }
            
            console.log(`🌐 Lancement Chrome sur ${url}...`);
            console.log(`✅ Chrome trouvé: ${chromiumPath}`);
            
            const args = [
                url,
                '--new-window',
                `--user-data-dir=${userDataDir}`
            ];
            
            // Flags dev uniquement si pas en production
            if (process.env.NODE_ENV !== 'production') {
                args.push('--disable-web-security', '--no-sandbox');
            }
            
            const chromiumProcess = spawn(chromiumPath, args, { stdio: 'ignore', detached: false });
            
            chromiumProcess.on('error', (error) => {
                console.error('❌ Erreur Chrome:', error.message);
            });
            
            chromiumProcess.on('exit', (code) => {
                if (code === 0) console.log('✅ Chrome lancé avec succès!');
                else console.warn(`⚠️ Chrome s'est terminé avec le code: ${code}`);
            });
            
            // Stocker le processus Chromium pour gestion
            this.chromiumProcess = chromiumProcess;
            
            return true;
        } catch (error) {
            console.error('❌ Échec lancement Chrome:', error.message);
            console.log(`📝 Accédez manuellement à ${url}`);
            return false;
        }
    }

    async waitForService(port, endpoint = '/api/status', timeout = 15000) {
        const start = Date.now();
        
        while (Date.now() - start < timeout) {
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 2000);
                
                const res = await fetch(`http://localhost:${port}${endpoint}`, { signal: controller.signal });
                
                clearTimeout(id);
                
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
        
        // 1. Analytics API (port 4002)
        this.startService('analytics', ['node', 'backend/api/analytics-api.js']);
        
        // 2. GUI Launcher (port 3000) - PRIORITAIRE
        this.startService('gui', ['node', 'scripts/setup/gui-launcher.js']);
        
        // 3. Service Orchestrator (port 4001)
        setTimeout(() => {
            this.startService('orchestrator', ['node', 'service-orchestrator.js']);
        }, 4000);
        
        console.log('✅ Tous les services démarrés');
        console.log('🔗 URLs d\'accès:');
        console.log('   🌐 Dashboard: http://localhost:3000');
        console.log('   📊 Analytics: http://localhost:4002/api/analytics/dashboard');
        console.log('   ⚙️ Orchestrator: http://localhost:4001/api/status');
        
        // Maintenir le processus en vie
        process.stdin.resume();
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