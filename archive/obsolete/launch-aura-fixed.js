#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const net = require('net');

// Fonction pour trouver un port disponible
async function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Fonction pour tuer les processus utilisant un port
async function killProcessesOnPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (!error && stdout) {
        const pids = stdout.trim().split('\n');
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, () => {
            console.log(`Processus ${pid} terminé`);
          });
        });
      }
      resolve();
    });
  });
}

async function main() {
  console.log('🚀 LANCEMENT AURA OSINT ECOSYSTEM COMPLET');
  console.log('════════════════════════════════════════════════════════════\n');
  
  try {
    // Nettoyage des ports
    console.log('🧹 Nettoyage des ports...');
    await killProcessesOnPort(4011);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Trouver un port disponible
    const backendPort = await findAvailablePort(4011);
    console.log(`✅ Port backend: ${backendPort}`);
    
    // Démarrage du backend
    console.log('\n📡 Démarrage backend...');
    const backendProcess = spawn('node', ['backend/mvp-server.js'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: backendPort }
    });
    
    // Attendre que le backend démarre
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Démarrage du navigateur AURA
    console.log('\n🌐 Lancement AURA Browser...');
    const browserProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'aura-browser'),
      stdio: 'inherit'
    });
    
    console.log('\n✅ Écosystème AURA OSINT démarré!');
    console.log(`📊 Backend API: http://localhost:${backendPort}`);
    console.log('\n⚡ Appuyez sur Ctrl+C pour arrêter');
    
    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt des services...');
      backendProcess.kill('SIGTERM');
      browserProcess.kill('SIGTERM');
      setTimeout(() => process.exit(0), 2000);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();