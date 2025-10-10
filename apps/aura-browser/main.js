const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const isDev = require('electron-is-dev');
const { spawn } = require('node:child_process');
const waitOn = require('wait-on');

// Configuration AURA OSINT ADVANCED ECOSYSTEM
app.setName('AURA OSINT ADVANCED ECOSYSTEM');
app.setPath('userData', path.join(app.getPath('appData'), 'AURA-OSINT-ADVANCED-ECOSYSTEM'));

let mainWindow;
let backendProc;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    title: 'AURA OSINT ADVANCED ECOSYSTEM',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    autoHideMenuBar: true,
    show: false
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('🚀 AURA OSINT ADVANCED ECOSYSTEM - Interface prête');
  });

  if (isDev) {
    const uiUrl = process.env.AURA_UI_URL || 'http://localhost:3000';
    mainWindow.loadURL(uiUrl);
  } else {
    const indexPath = path.join(process.resourcesPath, 'app-ui', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

async function startBackend() {
  if (backendProc) return;

  if (isDev) {
    backendProc = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['run', 'dev:api', '--prefix', 'backend'],
      { stdio: 'inherit', env: { ...process.env, API_PORT: '4011', HOST: '127.0.0.1' } }
    );
    backendProc.on('exit', () => backendProc = null);
    await waitOn({ resources: ['http://127.0.0.1:4011/health'], timeout: 30000 });
  } else {
    // Adaptez ce chemin si votre backend n'est pas server.js à la racine
    const serverPath = path.join(process.resourcesPath, '..', '..', 'server.js');
    backendProc = spawn(process.execPath, [serverPath], {
      stdio: 'inherit',
      env: { ...process.env, API_PORT: '4011', HOST: '127.0.0.1', NODE_ENV: 'production' }
    });
    backendProc.on('exit', () => backendProc = null);
    await waitOn({ resources: ['http://127.0.0.1:4011/health'], timeout: 30000 });
  }
}

app.whenReady().then(async () => {
  if (isDev) {
    await startBackend();
    await waitOn({ resources: ['http://127.0.0.1:3000'], timeout: 60000 });
  } else {
    await startBackend();
  }
  createWindow();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });
app.on('before-quit', () => { if (backendProc && !backendProc.killed) backendProc.kill(); });

ipcMain.handle('aura:health', async () => {
  try {
    const res = await fetch('http://127.0.0.1:4011/health');
    return await res.json();
  } catch {
    return { status: 'down' };
  }
});