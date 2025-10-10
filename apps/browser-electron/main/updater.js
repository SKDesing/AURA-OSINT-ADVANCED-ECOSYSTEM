const { autoUpdater } = require('electron-updater');
const { logger } = require('./logger');

/**
 * Auto-updater for AURA Browser
 */
class UpdateManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.updateAvailable = false;
  }

  initialize() {
    // Skip auto-update if disabled
    if (process.env.AURA_AUTOUPDATE === 'off') {
      logger.info('Auto-update disabled via AURA_AUTOUPDATE=off');
      return;
    }
    
    // Configure updater
    autoUpdater.checkForUpdatesAndNotify();
    
    autoUpdater.on('checking-for-update', () => {
      logger.info('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      this.updateAvailable = true;
      logger.info('Update available', { version: info.version });
      
      // Notify renderer
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('update-available', info);
      }
    });

    autoUpdater.on('update-not-available', (info) => {
      logger.info('Update not available', { version: info.version });
    });

    autoUpdater.on('error', (err) => {
      logger.error('Update error', { error: err.message });
    });

    autoUpdater.on('download-progress', (progressObj) => {
      logger.info('Update download progress', {
        percent: progressObj.percent,
        transferred: progressObj.transferred,
        total: progressObj.total
      });
      
      // Notify renderer
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('update-progress', progressObj);
      }
    });

    autoUpdater.on('update-downloaded', (info) => {
      logger.info('Update downloaded', { version: info.version });
      
      // Notify renderer
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('update-downloaded', info);
      }
    });
  }

  async checkForUpdates() {
    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      logger.error('Check for updates failed', { error: error.message });
      throw error;
    }
  }

  async quitAndInstall() {
    if (this.updateAvailable) {
      logger.info('Quitting and installing update');
      autoUpdater.quitAndInstall();
    }
  }
}

module.exports = { UpdateManager };