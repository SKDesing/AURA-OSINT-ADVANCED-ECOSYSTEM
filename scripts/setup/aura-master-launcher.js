#!/usr/bin/env node
// AURA Master Launcher - Démarrage séquentiel définitif

const { spawn, exec } = require('child_process');
const path = require('path');
const PortManager = require('./port-manager');

class AuraMasterLauncher {
    constructor() {
        this.portManager = new PortManager();
        this.services = new Map();
        this.chromiumPath = this.detectChromium();
    }

    detectChromium() {
        const paths = ['/usr/bin/chromium-browser', '/usr/bin/chromium', '/snap/bin/chromium'];
        const fs = require('fs');
        for (const path of paths) {
            if (fs.existsSync(path)) return path;
        }
        throw new Error('Chromium non détecté');
    }

    async launch() {
        console.log('🛡️ AURA Master Launcher - Démarrage définitif');
        
        // 1. Nettoyage complet
        await this.portManager.cleanAllPorts();
        
        // 2. Démarrage vitrine EN PREMIER (port 5000)
        await this.startVitrine();
        
        // 3. Démarrage services backend
        await this.startBackendServices();
        
        // 4. Démarrage wizard (port 3001)
        await this.startWizard();
        
        console.log('✅ AURA complètement opérationnel');
    }

    async startVitrine() {
        console.log('🌐 Démarrage vitrine marketing (port 5000)...');
        
        const vitrine = spawn('npm', ['start'], {
            cwd: path.join(__dirname, 'vitrine-freepik'),
            env: { ...process.env, PORT: '5000' },
            stdio: 'pipe'
        });
        
        this.services.set('vitrine', vitrine);
        
        // Attendre que la vitrine soit prête
        await this.portManager.waitForPort(5000);
        
        console.log('✅ Vitrine prête sur port 5000 (accès manuel: http://localhost:5000)');
    }

    async startBackendServices() {
        console.log('⚙️ Démarrage services backend...');
        
        // Analytics API (port 4002)
        const analytics = spawn('node', ['backend/api/analytics-api.js'], { stdio: 'pipe' });
        this.services.set('analytics', analytics);
        
        await this.portManager.waitForPort(4002);
        console.log('✅ Analytics API prêt (port 4002)');
    }

    async startWizard() {
        console.log('🖥️ Démarrage wizard installation (port 3001)...');
        
        const wizard = spawn('node', ['scripts/setup/gui-launcher.js'], { stdio: 'pipe' });
        this.services.set('wizard', wizard);
        
        await this.portManager.waitForPort(3001);
        
        // Ouvrir wizard dans Chromium principal
        const wizardCommand = `"${this.chromiumPath}" --app="http://localhost:3001/install" --start-maximized --user-data-dir=/tmp/aura-wizard`;
        exec(wizardCommand);
        
        console.log('✅ Wizard prêt (port 3001)');
    }

    stop() {
        console.log('🛑 Arrêt de tous les services...');
        for (const [name, service] of this.services) {
            service.kill('SIGTERM');
        }
        this.portManager.cleanAllPorts();
    }
}

// Gestion arrêt propre
process.on('SIGINT', () => {
    if (global.masterLauncher) global.masterLauncher.stop();
    process.exit(0);
});

if (require.main === module) {
    global.masterLauncher = new AuraMasterLauncher();
    global.masterLauncher.launch().catch(console.error);
}

module.exports = AuraMasterLauncher;