#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 LANCEMENT COMPLET ÉCOSYSTÈME AURA OSINT');
console.log('════════════════════════════════════════════════════════════');

const processes = [];

// 1. PostgreSQL
console.log('🗄️  Démarrage PostgreSQL...');
const pgProcess = spawn('docker', ['run', '--rm', '-p', '5432:5432', '-e', 'POSTGRES_PASSWORD=Phi1.618Golden!', '-e', 'POSTGRES_USER=root', '-e', 'POSTGRES_DB=aura_osint', 'postgres:15'], {
  stdio: 'pipe'
});
processes.push({ name: 'PostgreSQL', process: pgProcess, port: 5432 });

// 2. Redis
console.log('🔴 Démarrage Redis...');
const redisProcess = spawn('docker', ['run', '--rm', '-p', '6379:6379', 'redis:7-alpine'], {
  stdio: 'pipe'
});
processes.push({ name: 'Redis', process: redisProcess, port: 6379 });

// 3. Elasticsearch
console.log('🔍 Démarrage Elasticsearch...');
const esProcess = spawn('docker', ['run', '--rm', '-p', '9200:9200', '-p', '9300:9300', '-e', 'discovery.type=single-node', '-e', 'xpack.security.enabled=false', 'elasticsearch:8.11.0'], {
  stdio: 'pipe'
});
processes.push({ name: 'Elasticsearch', process: esProcess, port: 9200 });

// 4. Qdrant
console.log('🧠 Démarrage Qdrant...');
const qdrantProcess = spawn('docker', ['run', '--rm', '-p', '6333:6333', '-p', '6334:6334', 'qdrant/qdrant'], {
  stdio: 'pipe'
});
processes.push({ name: 'Qdrant', process: qdrantProcess, port: 6333 });

// Attendre que les bases de données démarrent
setTimeout(() => {
  // 5. Backend
  console.log('📡 Démarrage Backend...');
  const backendProcess = spawn('node', ['mvp-server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    env: { ...process.env, PORT: 4011 }
  });
  processes.push({ name: 'Backend', process: backendProcess, port: 4011 });

  // 6. AURA Browser
  setTimeout(() => {
    console.log('🌐 Lancement AURA Browser...');
    const browserProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'aura-browser'),
      stdio: 'inherit'
    });
    processes.push({ name: 'AURA Browser', process: browserProcess });
  }, 3000);

}, 10000);

// Afficher le résumé après 15 secondes
setTimeout(() => {
  console.log('\n✅ Écosystème AURA OSINT complet démarré!');
  console.log('════════════════════════════════════════════════════════════');
  console.log('📊 Backend: http://localhost:4011');
  console.log('🗄️  PostgreSQL: localhost:5432');
  console.log('🔴 Redis: localhost:6379');
  console.log('🔍 Elasticsearch: http://localhost:9200');
  console.log('🧠 Qdrant: http://localhost:6333');
  console.log('🌐 AURA Browser: Application Electron');
  console.log('\n⚡ Appuyez sur Ctrl+C pour arrêter tous les services');
}, 15000);

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\n🛑 Arrêt de l\'écosystème complet...');
  
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