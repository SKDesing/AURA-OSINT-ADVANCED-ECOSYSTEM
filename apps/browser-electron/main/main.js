const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ServiceManager } = require('./services/service-manager');
const { HealthMonitor } = require('./services/health-monitor');
const { SecurityManager } = require('./security');

class AuraBrowser {
  constructor() {
    this.mainWindow = null;
    this.serviceManager = new ServiceManager();
    this.healthMonitor = new HealthMonitor();
  }

  async initialize() {
    await app.whenReady();
    
    // Initialize security hardening
    SecurityManager.initialize();
    
    // Start backend services
    await this.startServices();
    
    // Create main window
    this.createMainWindow();
    
    // Setup IPC handlers
    this.setupIPC();
  }

  async startServices() {
    console.log('🚀 Starting AURA services...');
    
    try {
      // Start API backend
      await this.serviceManager.startService('api', {
        script: path.join(__dirname, '../../../backend/server.js'),
        port: 4011,
        env: { NODE_ENV: 'production' }
      });
      
      // Start live tracker
      await this.serviceManager.startService('live-tracker', {
        script: path.join(__dirname, '../../../live-tracker/server.js'),
        port: 4003
      });
      
      console.log('✅ All services started');
    } catch (error) {
      console.error('❌ Failed to start services:', error);
    }
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'windows/preload.js')
      },
      icon: path.join(__dirname, '../renderer/assets/icon.png'),
      titleBarStyle: 'default',
      show: false
    });

    // Load GUI (wait for services to be ready)
    setTimeout(() => {
      this.mainWindow.loadURL('http://localhost:4011');
      this.mainWindow.show();
    }, 3000);

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  setupIPC() {
    ipcMain.handle('get-service-status', async () => {
      return await this.healthMonitor.checkServices();
    });

    ipcMain.handle('restart-service', async (event, serviceName) => {
      return await this.serviceManager.restartService(serviceName);
    });
  }
}

// App lifecycle
const auraBrowser = new AuraBrowser();

app.on('ready', () => {
  auraBrowser.initialize();
});

app.on('window-all-closed', async () => {
  await auraBrowser.serviceManager.stopAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    auraBrowser.createMainWindow();
  }
});