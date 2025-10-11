#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 LANCEMENT AURA OSINT ECOSYSTEM COMPLET');
console.log('═'.repeat(60));

let backendProcess, browserProcess;

// 1. Démarrer le backend
console.log('\n📡 Démarrage backend...');
backendProcess = spawn('node', ['mvp-server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

// 2. Attendre 3 secondes puis lancer le browser
setTimeout(() => {
  console.log('\n🌐 Lancement AURA Browser...');
  
  // Installer les dépendances si nécessaire
  const installDeps = spawn('npm', ['install'], {
    cwd: path.join(__dirname, 'aura-browser'),
    stdio: 'inherit'
  });

  installDeps.on('close', (code) => {
    if (code === 0) {
      // Lancer le browser
      browserProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'aura-browser'),
        stdio: 'inherit'
      });
    }
  });
}, 3000);

console.log('\n✅ Écosystème AURA OSINT en cours de démarrage...');
console.log('📊 Backend API:        http://localhost:4011');
console.log('🌐 AURA Browser:       Interface Electron');
console.log('\n⚡ Appuyez sur Ctrl+C pour arrêter tous les services');

// Gestion de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt des services AURA...');
  if (backendProcess) backendProcess.kill('SIGTERM');
  if (browserProcess) browserProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (backendProcess) backendProcess.kill('SIGTERM');
  if (browserProcess) browserProcess.kill('SIGTERM');
  process.exit(0);
});