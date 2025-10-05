const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

class ProcessManager {
  constructor() {
    this.services = new Map();
    this.server = null;
    this.io = null;
    this.isShuttingDown = false;
  }

  async init() {
    // Créer serveur WebSocket pour communication avec dashboard
    this.server = http.createServer();
    this.io = new Server(this.server, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });

    this.setupSocketHandlers();
    
    // Démarrer sur port 9999 (port de contrôle)
    this.server.listen(9999, () => {
      console.log('🎮 Process Manager actif sur port 9999');
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('📡 Dashboard connecté');
      
      // Envoyer l'état actuel des services
      socket.emit('services-status', this.getServicesStatus());
      
      socket.on('start-service', (serviceName) => {
        this.startService(serviceName);
      });
      
      socket.on('stop-service', (serviceName) => {
        this.stopService(serviceName);
      });
      
      socket.on('restart-service', (serviceName) => {
        this.restartService(serviceName);
      });
    });
  }

  getServicesConfig() {
    return [
      { name: 'backend', cmd: 'node', args: ['enhanced-server.js'], cwd: 'live-tracker', port: 4000 },
      { name: 'analyser', cmd: 'node', args: ['server.js'], cwd: 'services/analyser', port: 3002 },
      { name: 'profiles', cmd: 'node', args: ['server.js'], cwd: 'services/profiles', port: 3003 },
      { name: 'lives', cmd: 'node', args: ['server.js'], cwd: 'services/lives', port: 3004 },
      { name: 'create', cmd: 'node', args: ['server.js'], cwd: 'services/create', port: 3005 },
      { name: 'database', cmd: 'node', args: ['server.js'], cwd: 'services/database', port: 3006 },
      { name: 'reports', cmd: 'node', args: ['server.js'], cwd: 'services/reports', port: 3007 },
      { name: 'forensic', cmd: 'node', args: ['server.js'], cwd: 'services/forensic-integration', port: 3008 }
    ];
  }

  async startService(serviceName) {
    const config = this.getServicesConfig().find(s => s.name === serviceName);
    if (!config) return;

    if (this.services.has(serviceName)) {
      console.log(`⚠️ Service ${serviceName} déjà démarré`);
      return;
    }

    const servicePath = path.join(__dirname, config.cwd);
    
    const childProcess = spawn(config.cmd, config.args, {
      cwd: servicePath,
      stdio: 'pipe',
      env: { ...process.env, SILENT_MODE: 'true' }
    });

    const serviceInfo = {
      process: childProcess,
      config,
      status: 'starting',
      logs: [],
      startTime: Date.now()
    };

    // Capturer les logs
    childProcess.stdout.on('data', (data) => {
      const log = { type: 'info', message: data.toString().trim(), timestamp: Date.now() };
      serviceInfo.logs.push(log);
      this.io.emit('service-log', { service: serviceName, log });
    });

    childProcess.stderr.on('data', (data) => {
      const log = { type: 'error', message: data.toString().trim(), timestamp: Date.now() };
      serviceInfo.logs.push(log);
      this.io.emit('service-log', { service: serviceName, log });
    });

    childProcess.on('exit', (code) => {
      serviceInfo.status = code === 0 ? 'stopped' : 'crashed';
      this.io.emit('service-status', { service: serviceName, status: serviceInfo.status });
      
      if (!this.isShuttingDown && code !== 0) {
        console.log(`🔄 Auto-restart ${serviceName} dans 5s`);
        setTimeout(() => this.startService(serviceName), 5000);
      }
    });

    this.services.set(serviceName, serviceInfo);
    
    // Attendre que le service soit prêt
    setTimeout(() => {
      serviceInfo.status = 'running';
      this.io.emit('service-status', { service: serviceName, status: 'running' });
      console.log(`✅ Service ${serviceName} démarré (port ${config.port})`);
    }, 2000);
  }

  stopService(serviceName) {
    const serviceInfo = this.services.get(serviceName);
    if (!serviceInfo) return;

    serviceInfo.process.kill('SIGTERM');
    this.services.delete(serviceName);
    console.log(`🛑 Service ${serviceName} arrêté`);
  }

  restartService(serviceName) {
    this.stopService(serviceName);
    setTimeout(() => this.startService(serviceName), 1000);
  }

  getServicesStatus() {
    const status = {};
    this.getServicesConfig().forEach(config => {
      const serviceInfo = this.services.get(config.name);
      status[config.name] = {
        status: serviceInfo ? serviceInfo.status : 'stopped',
        port: config.port,
        logs: serviceInfo ? serviceInfo.logs.slice(-50) : []
      };
    });
    return status;
  }

  async startAllServices() {
    console.log('🚀 Démarrage de tous les services en mode silencieux...');
    
    for (const config of this.getServicesConfig()) {
      await this.startService(config.name);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Tous les services démarrés');
  }

  shutdown() {
    this.isShuttingDown = true;
    console.log('🛑 Arrêt de tous les services...');
    
    for (const [name] of this.services) {
      this.stopService(name);
    }
    
    this.server.close();
  }
}

// Démarrage automatique
const manager = new ProcessManager();
manager.init().then(() => {
  manager.startAllServices();
});

// Gestion de l'arrêt
process.on('SIGINT', () => manager.shutdown());
process.on('SIGTERM', () => manager.shutdown());

module.exports = ProcessManager;