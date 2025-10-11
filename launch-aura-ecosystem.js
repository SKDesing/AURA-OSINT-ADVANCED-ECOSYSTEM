#!/usr/bin/env node
// AURA OSINT Ecosystem Launcher
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AuraEcosystemLauncher {
    constructor() {
        this.processes = [];
        this.baseDir = __dirname;
    }

    async startBackend() {
        console.log('🚀 Démarrage Backend MVP...');
        const backend = spawn('node', ['mvp-server.js'], {
            cwd: path.join(this.baseDir, 'backend'),
            stdio: 'inherit'
        });
        
        this.processes.push({ name: 'backend', process: backend });
        
        // Attendre que le backend soit prêt
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('✅ Backend démarré sur http://localhost:4011');
    }

    async startFrontendConfig() {
        console.log('🌐 Démarrage serveur configuration frontend...');
        const frontend = spawn('python3', ['-m', 'http.server', '8000'], {
            cwd: path.join(this.baseDir, 'frontend', 'config'),
            stdio: 'inherit'
        });
        
        this.processes.push({ name: 'frontend-config', process: frontend });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Frontend config sur http://localhost:8000');
    }

    async startDocumentation() {
        console.log('📚 Démarrage documentation interactive...');
        const docs = spawn('python3', ['-m', 'http.server', '8001'], {
            cwd: path.join(this.baseDir, 'DOCUMENTATION TECHNIQUE INTERACTIVE'),
            stdio: 'inherit'
        });
        
        this.processes.push({ name: 'documentation', process: docs });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Documentation sur http://localhost:8001');
    }

    async launchChromium() {
        console.log('🌐 Lancement Chromium AURA...');
        
        const chromiumArgs = [
            '--new-window',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--user-data-dir=/tmp/aura-chromium',
            'http://localhost:8000/backend-setup.html'
        ];

        const chromium = spawn('chromium-browser', chromiumArgs, {
            stdio: 'inherit',
            detached: true
        });

        this.processes.push({ name: 'chromium', process: chromium });
        console.log('✅ Chromium AURA lancé avec interface de configuration');
    }

    async start() {
        console.log('🔥 AURA OSINT ECOSYSTEM LAUNCHER');
        console.log('================================');
        
        try {
            await this.startBackend();
            await this.startFrontendConfig();
            await this.startDocumentation();
            await this.launchChromium();
            
            console.log('\n🎯 AURA OSINT ECOSYSTEM OPÉRATIONNEL');
            console.log('====================================');
            console.log('📊 Backend API:        http://localhost:4011');
            console.log('🔧 Configuration:      http://localhost:8000');
            console.log('📚 Documentation:      http://localhost:8001');
            console.log('🌐 Chromium AURA:      Interface lancée');
            console.log('\n⚡ Appuyez sur Ctrl+C pour arrêter tous les services');
            
        } catch (error) {
            console.error('❌ Erreur lors du démarrage:', error);
            this.cleanup();
        }
    }

    cleanup() {
        console.log('\n🛑 Arrêt des services AURA...');
        this.processes.forEach(({ name, process }) => {
            console.log(`  Arrêt ${name}...`);
            process.kill('SIGTERM');
        });
        process.exit(0);
    }
}

// Gestion des signaux d'arrêt
const launcher = new AuraEcosystemLauncher();

process.on('SIGINT', () => launcher.cleanup());
process.on('SIGTERM', () => launcher.cleanup());

// Démarrage
launcher.start().catch(console.error);