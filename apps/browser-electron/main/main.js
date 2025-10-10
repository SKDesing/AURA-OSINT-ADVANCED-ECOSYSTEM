const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ServiceManager } = require('./services/service-manager');
const { HealthMonitor } = require('./services/health-monitor');
const { SecurityManager } = require('./security');
const { IPCManager } = require('./ipc');
const { logger } = require('./logger');
const { UpdateManager } = require('./updater');

class AuraBrowser {
  constructor() {
    this.mainWindow = null;
    this.serviceManager = new ServiceManager();
    this.healthMonitor = new HealthMonitor();
    this.ipcManager = null;
    this.updateManager = null;
  }

  async initialize() {
    await app.whenReady();
    
    logger.info('🚀 AURA Browser initializing...');
    
    // Initialize security hardening
    SecurityManager.initialize();
    
    // Start backend services
    await this.startServices();
    
    // Create main window
    this.createMainWindow();
    
    // Initialize managers
    this.ipcManager = new IPCManager(this.serviceManager, this.healthMonitor);
    this.ipcManager.initialize();
    
    this.updateManager = new UpdateManager(this.mainWindow);
    this.updateManager.initialize();
    
    logger.info('✅ AURA Browser ready');
  }

  async startServices() {
    logger.info('🚀 Starting AURA services...');
    
    try {
      // Start API backend
      await this.serviceManager.startService('api', {
        script: path.join(__dirname, '../../../backend/mvp-server-fixed.js'),
        port: 4010,
        env: { NODE_ENV: 'production' }
      });
      
      // Start live tracker
      await this.serviceManager.startService('live-tracker', {
        script: path.join(__dirname, '../../../live-tracker/server.js'),
        port: 4003
      });
      
      logger.info('✅ All services started');
    } catch (error) {
      logger.error('❌ Failed to start services', { error: error.message });
      throw error;
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
        sandbox: true,
        preload: path.join(__dirname, 'windows/preload.js')
      },
      icon: path.join(__dirname, '../renderer/assets/icon.png'),
      titleBarStyle: 'default',
      show: false
    });

    // Load GUI (wait for services to be ready)
    setTimeout(() => {
      this.mainWindow.loadURL('http://localhost:4010');
      this.mainWindow.show();
      logger.info('Main window loaded and shown');
    }, 3000);

    this.mainWindow.on('closed', () => {
      logger.info('Main window closed');
      this.mainWindow = null;
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