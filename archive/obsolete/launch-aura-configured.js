#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

// Charger la configuration des ports
const configPath = path.join(__dirname, 'config', 'ports.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

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

// Fonction pour vérifier si un service est requis
function isServiceRequired(serviceName) {
  const servicePath = findServicePath(serviceName);
  return servicePath && fs.existsSync(servicePath);
}

// Fonction pour trouver le chemin d'un service
function findServicePath(serviceName) {
  const paths = {
    'backend': path.join(__dirname, 'backend'),
    'aura-browser': path.join(__dirname, 'aura-browser'),
    'frontend': path.join(__dirname, 'clients', 'web-react'),
    'documentation': path.join(__dirname, 'DOCUMENTATION TECHNIQUE INTERACTIVE')
  };
  
  return paths[serviceName] || null;
}

async function main() {
  console.log('🚀 LANCEMENT AURA OSINT - VERSION CONFIGURÉE');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`📋 Configuration: ${configPath}`);
  console.log(`🌐 Ecosystem: ${config.ecosystem.name} v${config.ecosystem.version}`);
  console.log("");
  
  const processes = [];
  
  try {
    // 1. Démarrer le Backend Principal
    if (isServiceRequired('backend')) {
      const backendPort = await findAvailablePort(config.ports.core.backend.port);
      console.log(`📡 Démarrage Backend Principal sur le port ${backendPort}...`);
      
      const backendProcess = spawn('node', ['mvp-server.js'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'inherit',
        env: { ...process.env, PORT: backendPort }
      });
      
      processes.push({ name: 'Backend', process: backendProcess, port: backendPort });
      
      // Attendre que le backend démarre
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // 2. Démarrer le Frontend (si existant)
    if (isServiceRequired('frontend')) {
      const frontendPort = await findAvailablePort(config.ports.core.frontend.port);
      console.log(`🌐 Démarrage Frontend React sur le port ${frontendPort}...`);
      
      const frontendProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'clients', 'web-react'),
        stdio: 'inherit',
        env: { ...process.env, PORT: frontendPort }
      });
      
      processes.push({ name: 'Frontend', process: frontendProcess, port: frontendPort });
    }
    
    // 3. Démarrer AURA Browser
    if (isServiceRequired('aura-browser')) {
      console.log('🌐 Lancement AURA Browser...');
      
      const browserProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'aura-browser'),
        stdio: 'inherit'
      });
      
      processes.push({ name: 'AURA Browser', process: browserProcess });
    }
    
    // 4. Démarrer la Documentation (si existante)
    if (isServiceRequired('documentation')) {
      const docPort = await findAvailablePort(config.ports.monitoring.documentation.port);
      console.log(`📚 Démarrage Documentation sur le port ${docPort}...`);
      
      const docProcess = spawn('python3', ['-m', 'http.server', docPort.toString()], {
        cwd: path.join(__dirname, 'DOCUMENTATION TECHNIQUE INTERACTIVE'),
        stdio: 'inherit'
      });
      
      processes.push({ name: 'Documentation', process: docProcess, port: docPort });
    }
    
    // Afficher le résumé
    console.log('\n✅ Écosystème AURA OSINT démarré avec succès!');
    console.log('════════════════════════════════════════════════════════════');
    
    processes.forEach(({ name, port }) => {
      if (port) {
        console.log(`📊 ${name}: http://localhost:${port}`);
      } else {
        console.log(`🌐 ${name}: Application Electron`);
      }
    });
    
    console.log('\n⚡ Appuyez sur Ctrl+C pour arrêter tous les services');
    
    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Arrêt de l\'écosystème AURA OSINT...');
      
      processes.forEach(({ name, process }) => {
        console.log(`Arrêt de ${name}...`);
        process.kill('SIGTERM');
      });
      
      setTimeout(() => {
        processes.forEach(({ process }) => {
          process.kill('SIGKILL');
        });
        process.exit(0);
      }, 3000);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error.message);
    process.exit(1);
  }
}

main();