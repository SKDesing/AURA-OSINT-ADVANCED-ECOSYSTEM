#!/usr/bin/env node
// AURA Service Orchestrator - Lancement sécurisé des services

const { spawn } = require('child_process');
const { config } = require('./config.js');

const services = {
    'frontend': { 
        cmd: 'npm', 
        args: ['start'], 
        cwd: './frontend',
        port: config.frontend.port,
        env: { PORT: config.frontend.port }
    },
    'backend': { 
        cmd: 'node', 
        args: ['server.js'], 
        cwd: './backend',
        port: config.backend.main,
        env: { PORT: config.backend.main }
    },
    'landing': { 
        cmd: 'npm', 
        args: ['start'], 
        cwd: './aura-landing-page',
        port: config.frontend.landing,
        env: { PORT: config.frontend.landing }
    },
    'osint': { 
        cmd: 'node', 
        args: ['osint-server.js'], 
        cwd: './osint-tools',
        port: config.frontend.osint,
        env: { PORT: config.frontend.osint }
    }
};

class ServiceOrchestrator {
    constructor() {
        this.runningServices = new Map();
    }

    async start(serviceName) {
        if (!services[serviceName]) {
            console.log(`❌ Service inconnu: ${serviceName}`);
            return false;
        }

        if (this.runningServices.has(serviceName)) {
            console.log(`⚠️  Service ${serviceName} déjà en cours`);
            return false;
        }

        const service = services[serviceName];
        console.log(`🚀 Démarrage ${serviceName} sur port ${service.port}...`);

        const process = spawn(service.cmd, service.args, {
            cwd: service.cwd,
            env: { ...process.env, ...service.env },
            stdio: 'inherit'
        });

        process.on('error', (err) => {
            console.log(`❌ Erreur ${serviceName}: ${err.message}`);
            this.runningServices.delete(serviceName);
        });

        process.on('exit', (code) => {
            console.log(`🛑 ${serviceName} arrêté (code: ${code})`);
            this.runningServices.delete(serviceName);
        });

        this.runningServices.set(serviceName, process);
        return true;
    }

    stop(serviceName) {
        const process = this.runningServices.get(serviceName);
        if (process) {
            process.kill();
            console.log(`🛑 Arrêt de ${serviceName}`);
            return true;
        }
        console.log(`⚠️  Service ${serviceName} non trouvé`);
        return false;
    }

    stopAll() {
        console.log('🛑 Arrêt de tous les services...');
        for (const [name, process] of this.runningServices) {
            process.kill();
            console.log(`   - ${name} arrêté`);
        }
        this.runningServices.clear();
    }

    status() {
        console.log('📊 État des services:');
        Object.keys(services).forEach(name => {
            const status = this.runningServices.has(name) ? '🟢 EN COURS' : '🔴 ARRÊTÉ';
            const port = services[name].port;
            console.log(`   ${name}: ${status} (port ${port})`);
        });
    }
}

// CLI
if (require.main === module) {
    const orchestrator = new ServiceOrchestrator();
    const command = process.argv[2];
    const serviceName = process.argv[3];

    switch (command) {
        case 'start':
            if (serviceName) {
                orchestrator.start(serviceName);
            } else {
                console.log('Usage: node service-orchestrator.js start <service>');
                console.log('Services disponibles:', Object.keys(services).join(', '));
            }
            break;
        case 'stop':
            if (serviceName) {
                orchestrator.stop(serviceName);
            } else {
                orchestrator.stopAll();
            }
            break;
        case 'status':
            orchestrator.status();
            break;
        default:
            console.log('🎯 AURA Service Orchestrator');
            console.log('Usage:');
            console.log('  node service-orchestrator.js start <service>');
            console.log('  node service-orchestrator.js stop [service]');
            console.log('  node service-orchestrator.js status');
    }

    // Gestion propre de l'arrêt
    process.on('SIGINT', () => {
        orchestrator.stopAll();
        process.exit(0);
    });
}

module.exports = ServiceOrchestrator;