const { app, BrowserWindow, session, protocol, ipcMain } = require('electron');
const path = require('node:path');
const isDev = require('electron-is-dev');
const { spawn } = require('node:child_process');
const waitOn = require('wait-on');

app.setName('AURA OSINT ADVANCED ECOSYSTEM');
app.setAppUserModelId('com.aura.osint.advanced.ecosystem');
app.setPath('userData', path.join(app.getPath('appData'), 'AURA-OSINT-ADVANCED-ECOSYSTEM'));

let mainWindow, backendProc, webProc;

const UI_DEV_URL = process.env.AURA_UI_URL || 'http://127.0.0.1:3000';
const API_URL = process.env.AURA_API_URL || 'http://127.0.0.1:4011';

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'AURA OSINT ADVANCED ECOSYSTEM',
    width: 1440,
    height: 900,
    backgroundColor: '#0f0f0f',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: 'persist:aura-ui'
    }
  });

  if (isDev) {
    mainWindow.loadURL(UI_DEV_URL);
  } else {
    mainWindow.loadFile(path.join(process.resourcesPath, 'app-ui', 'index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

async function startBackend() {
  if (backendProc) return;
  const env = { ...process.env, API_PORT: '4011', HOST: '127.0.0.1', ELECTRON_LAUNCH: '1' };
  if (isDev) {
    backendProc = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['run', 'dev:api', '--prefix', 'backend'],
      { stdio: 'inherit', env }
    );
  } else {
    const serverPath = path.join(process.resourcesPath, '..', '..', 'backend', 'server.js');
    backendProc = spawn(process.execPath, [serverPath], {
      stdio: 'inherit',
      env: { ...env, NODE_ENV: 'production' }
    });
  }
  backendProc.on('exit', () => backendProc = null);
  await waitOn({ resources: [`${API_URL}/health`], timeout: 60000 });
}

async function startWebDev() {
  if (!isDev || webProc) return;
  const env = { ...process.env, PORT: '3000', HOST: '127.0.0.1', BROWSER: 'none' };
  webProc = spawn(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    ['--filter', './clients/web-react', 'start'],
    { stdio: 'inherit', env }
  );
  webProc.on('exit', () => webProc = null);
  await waitOn({ resources: [UI_DEV_URL], timeout: 120000 });
}

function setupSessionPolicies() {
  const ses = session.defaultSession;
  ses.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AURA/1.0 Chrome/124.0.0.0 Safari/537.36');
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['X-AURA-Client'] = 'AURA OSINT ADVANCED ECOSYSTEM';
    callback({ requestHeaders: details.requestHeaders });
  });
}

function registerAuraProtocol() {
  protocol.registerFileProtocol('aura', (req, cb) => {
    cb({ path: path.normalize(path.join(process.resourcesPath, 'app-ui', 'index.html')) });
  });
}

app.whenReady().then(async () => {
  registerAuraProtocol();
  setupSessionPolicies();
  await startBackend();
  await startWebDev();
  createWindow();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });
app.on('before-quit', () => {
  if (backendProc && !backendProc.killed) backendProc.kill();
  if (webProc && !webProc.killed) webProc.kill();
});

ipcMain.handle('aura:health', async () => {
  try {
    const res = await fetch(`${API_URL}/health`);
    return await res.json();
  } catch { return { status: 'down' }; }
});