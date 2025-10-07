#!/usr/bin/env node
// AURA GUI Launcher - Interface Graphique Zéro CLI

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

class AuraGUILauncher {
    constructor() {
        this.app = express();
        this.port = 3000;
        this.services = new Map();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'gui')));
        this.app.use('/assets', express.static(path.join(__dirname, 'gui/assets')));
    }

    setupRoutes() {
        // Page principale
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'gui', 'index.html'));
        });

        // API Status système
        this.app.get('/api/status', (req, res) => {
            res.json({
                status: 'running',
                services: Array.from(this.services.keys()),
                timestamp: new Date().toISOString()
            });
        });

        // API Installation automatique
        this.app.post('/api/install', async (req, res) => {
            try {
                await this.runInstallation();
                res.json({ success: true, message: 'Installation terminée' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // API Migration Chromium
        this.app.post('/api/migrate-chromium', async (req, res) => {
            try {
                await this.runMigration();
                res.json({ success: true, message: 'Migration Chromium terminée' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // API Démarrage services
        this.app.post('/api/start-service/:name', (req, res) => {
            const serviceName = req.params.name;
            this.startService(serviceName);
            res.json({ success: true, message: `Service ${serviceName} démarré` });
        });

        // API Diagnostic
        this.app.get('/api/diagnostic', async (req, res) => {
            const diagnostic = await this.generateDiagnostic();
            res.json(diagnostic);
        });

        // API Chromium Control (nouvelle architecture)
        const chromiumControlAPI = require('./api/chromium-control-api');
        this.app.use('/api/chromium', chromiumControlAPI);
        
        // API Forensique (Axe C)
        const forensicAPI = require('./api/forensic-api');
        this.app.use('/api/forensic', forensicAPI);

        // API Chromium compliance (legacy)
        this.app.get('/api/chromium/scan', async (req, res) => {
            try {
                const scanner = spawn('node', ['chromium-only-enforcer.js', '--scan-only']);
                let output = '';
                scanner.stdout.on('data', (data) => output += data.toString());
                scanner.on('close', (code) => {
                    const violations = (output.match(/VIOLATION:/g) || []).length;
                    res.json({ violations, details: output });
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/chromium/fix', async (req, res) => {
            try {
                const fixer = spawn('npm', ['run', 'fix-browser-calls']);
                fixer.on('close', (code) => {
                    res.json({ success: code === 0, fixed: code === 0 ? 'Toutes' : 0 });
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Proxy vers Stealth API
        this.app.use('/api/stealth', this.createStealthProxy());
        
        // API Security management
        this.app.get('/api/security/status', async (req, res) => {
            try {
                const SecurityManager = require('./security-manager');
                const manager = new SecurityManager();
                res.json(manager.checkEncryptionStatus());
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/security/report', async (req, res) => {
            try {
                const SecurityManager = require('./security-manager');
                const manager = new SecurityManager();
                res.json(manager.generateSecurityReport());
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    async runInstallation() {
        return new Promise((resolve, reject) => {
            const install = spawn('npm', ['run', 'full-setup'], { stdio: 'pipe' });
            
            install.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Installation échouée (code: ${code})`));
            });
        });
    }

    async runMigration() {
        return new Promise((resolve, reject) => {
            const migrate = spawn('npm', ['run', 'migrate-chromium'], { stdio: 'pipe' });
            
            migrate.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Migration échouée (code: ${code})`));
            });
        });
    }

    startService(name) {
        if (this.services.has(name)) return;

        const serviceCommands = {
            'analytics': ['node', 'analytics-api.js'],
            'orchestrator': ['node', 'service-orchestrator.js'],
            'landing': ['npm', 'start']
        };

        const cmd = serviceCommands[name];
        if (!cmd) return;

        const service = spawn(cmd[0], cmd.slice(1), { stdio: 'pipe' });
        this.services.set(name, service);

        service.on('exit', () => {
            this.services.delete(name);
        });
    }

    async generateDiagnostic() {
        const QuickStart = require('./quick-start.js');
        const quickStart = new QuickStart();
        
        // Simulation du diagnostic
        return {
            system: {
                os: process.platform,
                node: process.version,
                memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
            },
            services: Array.from(this.services.keys()),
            files: {
                chromium_launcher: fs.existsSync('chromium-launcher.js'),
                correlation_engine: fs.existsSync('correlation-engine-complete.js'),
                migration_script: fs.existsSync('migrate-to-chromium.js')
            },
            timestamp: new Date().toISOString()
        };
    }

    start() {
        console.log('🖥️  AURA GUI en cours de démarrage...');
        
        // LANCER CHROMIUM IMMÉDIATEMENT avec wizard
        try {
            const ChromiumEnforcer = require('./chromium-enforcer');
            ChromiumEnforcer.enforceChromiumOnly();
            ChromiumEnforcer.launchWithStartup();
        } catch (error) {
            console.log('⚠️ Chromium non disponible, continuez manuellement sur http://localhost:3000');
        }
        
        this.app.listen(this.port, () => {
            console.log(`✅ AURA GUI prête sur http://localhost:${this.port}`);
            console.log('🎯 Interface Zéro CLI disponible');
            console.log('🌐 Chromium ouvert avec wizard d\'installation');
        });
    }

    createStealthProxy() {
        return async (req, res) => {
            try {
                const fetch = require('node-fetch');
                const targetUrl = `http://localhost:4003${req.originalUrl}`;
                
                const response = await fetch(targetUrl, {
                    method: req.method,
                    headers: req.headers,
                    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
                });
                
                const data = await response.json();
                res.status(response.status).json(data);
                
            } catch (error) {
                res.status(500).json({ error: 'Stealth API non disponible' });
            }
        };
    }

    openBrowser() {
        // Cette méthode est maintenant gérée par ChromiumEnforcer
        // Chromium est lancé AVANT le démarrage du serveur
        console.log('🌐 Chromium déjà lancé avec wizard d\'installation');
    }
}

// Démarrage si appelé directement
if (require.main === module) {
    const launcher = new AuraGUILauncher();
    launcher.start();
}

module.exports = AuraGUILauncher;