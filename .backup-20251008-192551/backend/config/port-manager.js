#!/usr/bin/env node
// AURA Port Manager - Gestion centralisée des ports

const { exec } = require('child_process');

class PortManager {
    constructor() {
        this.ports = {
            vitrine: 5000,
            wizard: 3001,
            analytics: 4002,
            forensic: 4004,
            stealth: 4003
        };
    }

    async killPort(port) {
        return new Promise((resolve) => {
            exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, () => {
                resolve();
            });
        });
    }

    async cleanAllPorts() {
        console.log('🧹 Nettoyage des ports...');
        
        // Tuer tous les processus Node.js AURA
        await new Promise((resolve) => {
            exec('pkill -f "node.*gui-launcher" 2>/dev/null || true', resolve);
        });
        
        await new Promise((resolve) => {
            exec('pkill -f "node.*analytics-api" 2>/dev/null || true', resolve);
        });
        
        await new Promise((resolve) => {
            exec('pkill -f "react-scripts" 2>/dev/null || true', resolve);
        });

        // Nettoyer les ports spécifiques
        for (const port of Object.values(this.ports)) {
            await this.killPort(port);
        }

        // Nettoyer les ports aléatoires React
        const randomPorts = [54112, 54113, 54114, 3000];
        for (const port of randomPorts) {
            await this.killPort(port);
        }

        await new Promise(r => setTimeout(r, 2000));
        console.log('✅ Ports nettoyés');
    }

    async checkPort(port) {
        return new Promise((resolve) => {
            exec(`lsof -ti:${port}`, (error) => {
                resolve(!error); // true si occupé
            });
        });
    }

    async waitForPort(port, timeout = 10000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (await this.checkPort(port)) {
                return true;
            }
            await new Promise(r => setTimeout(r, 500));
        }
        return false;
    }
}

module.exports = PortManager;