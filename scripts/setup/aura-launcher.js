#!/usr/bin/env node
// AURA Enterprise Launcher - One Window Experience

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AuraLauncher {
    constructor() {
        this.chromiumPath = this.detectChromium();
        this.startupFile = path.join(__dirname, 'startup-wizard.html');
        this.services = [];
    }

    detectChromium() {
        const paths = [
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium',
            '/usr/bin/google-chrome'
        ];
        
        for (const path of paths) {
            if (fs.existsSync(path)) return path;
        }
        throw new Error('Chromium non détecté');
    }

    async launch() {
        console.log('🛡️ AURA OSINT - Démarrage Enterprise');
        
        // 1. Nettoyer les ports
        await this.cleanup();
        
        // 2. Démarrer services backend silencieusement
        this.startBackendServices();
        
        // 3. Lancer Chromium optimisé
        this.launchChromium();
        
        console.log('✅ AURA lancé - Interface Chromium ouverte');
    }

    async cleanup() {
        const ports = [3000, 3001, 4002];
        for (const port of ports) {
            exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    startBackendServices() {
        // Analytics API
        const analytics = spawn('node', ['backend/api/analytics-api.js'], { 
            stdio: 'ignore', 
            detached: true 
        });
        
        // GUI Launcher  
        setTimeout(() => {
            const gui = spawn('node', ['gui-launcher.js'], { 
                stdio: 'ignore', 
                detached: true 
            });
            this.services.push(gui);
        }, 2000);
        
        this.services.push(analytics);
    }

    launchChromium() {
        const flags = [
            `--app=http://localhost:3001/install`,
            '--start-maximized',
            '--disable-extensions',
            '--disable-features=TranslateUI,Sync,Autofill,SafeBrowsing,Notifications',
            '--no-default-browser-check',
            '--disable-web-security',
            '--user-data-dir=/tmp/aura-profile',
            '--disable-dev-shm-usage'
        ];

        const command = `"${this.chromiumPath}" ${flags.join(' ')}`;
        
        exec(command, (error) => {
            if (error) {
                console.error('❌ Erreur Chromium:', error.message);
                console.log('📝 Ouvrez manuellement: http://localhost:3001');
            }
        });
    }

    stop() {
        this.services.forEach(service => {
            if (service && !service.killed) {
                service.kill('SIGTERM');
            }
        });
    }
}

// Gestion arrêt propre
process.on('SIGINT', () => {
    if (global.launcher) global.launcher.stop();
    process.exit(0);
});

// Démarrage
if (require.main === module) {
    global.launcher = new AuraLauncher();
    global.launcher.launch().catch(console.error);
}

module.exports = AuraLauncher;