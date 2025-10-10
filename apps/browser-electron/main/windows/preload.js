const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Service management
  getServiceStatus: () => ipcRenderer.invoke('get-service-status'),
  restartService: (serviceName) => ipcRenderer.invoke('restart-service', serviceName),
  
  // System info
  getVersion: () => process.versions.electron,
  getPlatform: () => process.platform,
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // Events
  onServiceStatusChange: (callback) => {
    ipcRenderer.on('service-status-changed', callback);
  },
  
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Security: Remove Node.js globals
delete window.require;
delete window.exports;
delete window.module;