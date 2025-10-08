const StealthProxy = require('./stealth-proxy');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class StealthLauncher {
  constructor() {
    this.proxy = new StealthProxy(8888);
    this.chromiumPath = this.findChromiumPath();
    this.reactPort = 3000;
    this.processes = [];
  }

  findChromiumPath() {
    const paths = [
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome',
      path.join(__dirname, '../aura-browser/aura'),
      '/opt/brave.com/brave/brave-browser'
    ];
    
    return paths.find(p => fs.existsSync(p)) || '/usr/bin/chromium';
  }

  async startProxy() {
    console.log('🚀 Starting AURA Stealth Proxy...');
    this.proxyServer = this.proxy.start();
    await this.waitForPort(8888);
    console.log('✅ Proxy ready');
  }

  async startReactApp() {
    console.log('🚀 Starting React Frontend...');
    const reactProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '../frontend-react'),
      stdio: 'pipe',
      env: { ...process.env, PORT: this.reactPort }
    });

    this.processes.push(reactProcess);
    await this.waitForPort(this.reactPort);
    console.log('✅ React app ready');
  }

  async launchChromium() {
    console.log('🚀 Launching Chromium with stealth configuration...');
    
    const profileDir = path.join(__dirname, '../aura-browser/profile-stealth');
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
    }

    const chromiumArgs = [
      `--proxy-server=127.0.0.1:XXXX`,
      `--user-data-dir=${profileDir}`,
      `--app=http://localhost:XXXX${this.reactPort}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--window-size=1920,1080',
      '--start-maximized'
    ];

    const chromiumProcess = spawn(this.chromiumPath, chromiumArgs, {
      stdio: 'pipe',
      detached: false
    });

    this.processes.push(chromiumProcess);
    console.log('✅ Chromium launched in stealth mode');
  }

  async waitForPort(port, timeout = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const net = require('net');
        const socket = new net.Socket();
        await new Promise((resolve, reject) => {
          socket.connect(port, '127.0.0.1', resolve);
          socket.on('error', reject);
          setTimeout(reject, 1000);
        });
        socket.destroy();
        return true;
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    throw new Error(`Port ${port} not ready after ${timeout}ms`);
  }

  async launch() {
    try {
      console.log('🔥 AURA STEALTH SYSTEM - STARTING...');
      
      await this.startProxy();
      await this.startReactApp();
      await this.launchChromium();
      
      console.log('🎯 AURA STEALTH SYSTEM - READY');
      console.log('📊 Network traffic intercepted via proxy');
      console.log('🌐 Frontend accessible at http://localhost:XXXX');
      console.log('🔒 All TikTok traffic logged for forensic analysis');
      
      this.setupCleanup();
      
    } catch (error) {
      console.error('❌ Launch failed:', error);
      this.cleanup();
    }
  }

  setupCleanup() {
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
    process.on('exit', () => this.cleanup());
  }

  cleanup() {
    console.log('🧹 Cleaning up processes...');
    this.processes.forEach(proc => {
      try {
        proc.kill('SIGTERM');
      } catch (e) {}
    });
    
    if (this.proxyServer) {
      this.proxyServer.close();
    }
    
    process.exit(0);
  }

  getNetworkEvidence() {
    return this.proxy.getInterceptedData();
  }

  exportEvidence() {
    return this.proxy.exportEvidence();
  }
}

if (require.main === module) {
  const launcher = new StealthLauncher();
  launcher.launch();
}

module.exports = StealthLauncher;