#!/usr/bin/env node
// AURA Port Audit - Détection automatique des conflits de ports

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORTS_CONFIG = './ports-config.env';
const EXPECTED_PORTS = {};

// Charger la config des ports
if (fs.existsSync(PORTS_CONFIG)) {
    const config = fs.readFileSync(PORTS_CONFIG, 'utf8');
    config.split('\n').forEach(line => {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            EXPECTED_PORTS[key.trim()] = parseInt(value.trim());
        }
    });
}

console.log('🔍 AURA Port Audit - Analyse des conflits');
console.log('=========================================');

// Vérifier les ports ouverts
exec('netstat -tuln 2>/dev/null || ss -tuln', (error, stdout) => {
    if (error) {
        console.log('⚠️  Impossible de scanner les ports');
        return;
    }

    const openPorts = [];
    const lines = stdout.split('\n');
    
    lines.forEach(line => {
        const match = line.match(/:(\d+)\s/);
        if (match) {
            openPorts.push(parseInt(match[1]));
        }
    });

    console.log(`📊 Ports ouverts détectés: ${openPorts.length}`);
    
    // Analyser les conflits
    const conflicts = [];
    const auraPortsInUse = [];
    
    Object.entries(EXPECTED_PORTS).forEach(([service, port]) => {
        if (openPorts.includes(port)) {
            auraPortsInUse.push({ service, port });
        }
    });

    console.log('\n✅ Ports AURA actuellement utilisés:');
    auraPortsInUse.forEach(({ service, port }) => {
        console.log(`   ${service}: ${port}`);
    });

    // Détecter les doublons dans la config
    const portValues = Object.values(EXPECTED_PORTS);
    const duplicates = portValues.filter((port, index) => portValues.indexOf(port) !== index);
    
    if (duplicates.length > 0) {
        console.log('\n❌ CONFLITS DÉTECTÉS dans la configuration:');
        duplicates.forEach(port => {
            const services = Object.entries(EXPECTED_PORTS)
                .filter(([, p]) => p === port)
                .map(([service]) => service);
            console.log(`   Port ${port}: ${services.join(', ')}`);
        });
    }

    console.log('\n📋 Résumé:');
    console.log(`   - Services AURA configurés: ${Object.keys(EXPECTED_PORTS).length}`);
    console.log(`   - Ports AURA en cours d'usage: ${auraPortsInUse.length}`);
    console.log(`   - Conflits de configuration: ${duplicates.length}`);
    
    if (duplicates.length === 0 && auraPortsInUse.length > 0) {
        console.log('\n🎯 Configuration des ports: OK');
    }
});