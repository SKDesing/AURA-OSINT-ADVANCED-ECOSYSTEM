const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('AURA_OSINT', {
  health: () => ipcRenderer.invoke('aura:health'),
  appName: 'AURA OSINT ADVANCED ECOSYSTEM',
  version: process.versions.electron
});