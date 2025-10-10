const { spawn } = require('child_process');
const axios = require('axios');

class ServiceManager {
  constructor() {
    this.services = new Map();
  }

  async startService(name, config) {
    console.log(`🔄 Starting service: ${name} on port ${config.port}`);
    
    const process = spawn('node', [config.script], {
      env: { 
        ...process.env, 
        PORT: config.port.toString(),
        ...config.env 
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Log service output
    process.stdout.on('data', (data) => {
      console.log(`[${name}] ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`[${name}] ERROR: ${data.toString().trim()}`);
    });

    process.on('exit', (code) => {
      console.log(`[${name}] Process exited with code ${code}`);
      this.services.delete(name);
    });

    this.services.set(name, { process, config });

    // Wait for service to be ready
    await this.waitForHealth(config.port, 30000);
    console.log(`✅ Service ${name} ready on port ${config.port}`);
  }

  async waitForHealth(port, timeout = 10000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      try {
        await axios.get(`http://localhost:${port}/health`, { timeout: 1000 });
        return true;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    throw new Error(`Service on port ${port} not ready after ${timeout}ms`);
  }

  async restartService(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    // Kill existing process
    service.process.kill();
    this.services.delete(name);

    // Restart
    await this.startService(name, service.config);
  }

  async stopAll() {
    console.log('🛑 Stopping all services...');
    
    for (const [name, service] of this.services) {
      console.log(`Stopping ${name}...`);
      service.process.kill();
    }
    
    this.services.clear();
    console.log('✅ All services stopped');
  }

  getServiceStatus() {
    const status = {};
    for (const [name, service] of this.services) {
      status[name] = {
        running: !service.process.killed,
        pid: service.process.pid,
        port: service.config.port
      };
    }
    return status;
  }
}

module.exports = { ServiceManager };