const { ipcMain } = require('electron');
const { logger } = require('./logger');

/**
 * Centralized IPC handler with allowlist and validation
 */
class IPCManager {
  constructor(serviceManager, healthMonitor) {
    this.serviceManager = serviceManager;
    this.healthMonitor = healthMonitor;
    this.allowedChannels = new Set([
      'get-service-status',
      'restart-service',
      'get-logs',
      'check-updates'
    ]);
  }

  initialize() {
    // Service status
    ipcMain.handle('get-service-status', async () => {
      try {
        const status = await this.healthMonitor.checkServices();
        logger.info('IPC: service status requested', { status });
        return status;
      } catch (error) {
        logger.error('IPC: service status failed', { error: error.message });
        throw error;
      }
    });

    // Service restart
    ipcMain.handle('restart-service', async (event, serviceName) => {
      if (!serviceName || typeof serviceName !== 'string') {
        throw new Error('Invalid service name');
      }
      
      try {
        const result = await this.serviceManager.restartService(serviceName);
        logger.info('IPC: service restarted', { serviceName, result });
        return result;
      } catch (error) {
        logger.error('IPC: service restart failed', { serviceName, error: error.message });
        throw error;
      }
    });

    // Get logs
    ipcMain.handle('get-logs', async (event, options = {}) => {
      try {
        const logs = await logger.getLogs(options);
        return logs;
      } catch (error) {
        logger.error('IPC: get logs failed', { error: error.message });
        throw error;
      }
    });

    logger.info('IPC handlers initialized', { channels: Array.from(this.allowedChannels) });
  }

  validateChannel(channel) {
    return this.allowedChannels.has(channel);
  }
}

module.exports = { IPCManager };