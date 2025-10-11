const { app, protocol, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Enregistrer les schémas AVANT l'initialisation
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'aura',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: false,
      bypassCSP: true
    }
  }
]);

class AuraChromiumEngine {
  constructor() {
    this.mainWindow = null;
  }

  async initialize() {
    await app.whenReady();
    this.registerProtocolHandlers();
    this.createMainWindow();
    this.setupEventHandlers();
    console.log('✅ Moteur AURA initialisé');
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.mainWindow.loadURL('aura://dashboard');
    
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });
  }

  registerProtocolHandlers() {
    protocol.registerFileProtocol('aura', (request, callback) => {
      const url = request.url.replace('aura://', '');
      const page = url.split('?')[0] || 'dashboard';
      
      const routes = {
        'dashboard': 'pages/dashboard.html',
        'investigations': 'pages/investigations.html',
        'tools': 'pages/tools.html',
        'settings': 'pages/settings.html'
      };

      const route = routes[page] || 'pages/dashboard.html';
      const filePath = path.join(__dirname, 'frontend-embedded', route);

      if (fs.existsSync(filePath)) {
        callback({ path: filePath });
      } else {
        // Créer une page par défaut si elle n'existe pas
        const defaultHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>AURA OSINT - ${page}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #2c3e50; color: white; }
              .container { max-width: 800px; margin: 0 auto; text-align: center; }
              .logo { font-size: 3em; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🎯</div>
              <h1>AURA OSINT</h1>
              <h2>Page: ${page}</h2>
              <p>Interface en cours de développement...</p>
            </div>
          </body>
          </html>
        `;
        
        const tempPath = path.join(__dirname, 'temp.html');
        fs.writeFileSync(tempPath, defaultHtml);
        callback({ path: tempPath });
      }
    });
  }

  setupEventHandlers() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });
  }
}

const auraEngine = new AuraChromiumEngine();
auraEngine.initialize().catch(error => {
  console.error('❌ Erreur moteur AURA:', error);
  app.quit();
});