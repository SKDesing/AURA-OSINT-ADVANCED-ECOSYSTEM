const { app, protocol, BrowserWindow } = require('electron');
const path = require('path');

// Enregistrer les schémas AVANT l'initialisation
try {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'aura',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: false,
        bypassCSP: true,
        allowServiceWorkers: true,
        stream: true
      }
    }
  ]);
  console.log('✅ Protocoles AURA enregistrés avec succès');
} catch (error) {
  console.error('❌ Erreur lors de l\'enregistrement des protocoles:', error);
}

class AuraChromiumEngine {
  constructor() {
    this.mainWindow = null;
  }

  async initialize() {
    try {
      await app.whenReady();
      console.log('✅ App Electron prêt');
      
      this.registerProtocolHandlers();
      this.createMainWindow();
      this.setupEventHandlers();
      
      console.log('✅ Moteur AURA initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du moteur AURA:', error);
      app.quit();
    }
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
      title: 'AURA OSINT Browser'
    });

    // Charger la page de démarrage
    this.mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>AURA OSINT Dashboard</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0e27, #1a1f3a);
            color: #fff;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .container {
            text-align: center;
            max-width: 800px;
            padding: 20px;
          }
          .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ffd700, #ff8c00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.8;
          }
          .status {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 2rem;
          }
          .status-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .status-ok {
            color: #4caf50;
          }
          .button {
            background: linear-gradient(45deg, #ffd700, #ff8c00);
            color: #0a0e27;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            margin: 10px;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: scale(1.05);
          }
          .version {
            position: absolute;
            bottom: 20px;
            right: 20px;
            opacity: 0.6;
            font-size: 0.8rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌟 AURA</div>
          <h1>OSINT Investigation Platform</h1>
          <div class="subtitle">Advanced Open-Source Intelligence Investigation System</div>
          
          <div class="status">
            <div class="status-item">
              <span>Backend API:</span>
              <span class="status-ok">✅ Connecté (http://localhost:4011)</span>
            </div>
            <div class="status-item">
              <span>Base de données:</span>
              <span class="status-ok">✅ PostgreSQL</span>
            </div>
            <div class="status-item">
              <span>Moteur de recherche:</span>
              <span class="status-ok">✅ Elasticsearch</span>
            </div>
            <div class="status-item">
              <span>AI Assistant:</span>
              <span class="status-ok">✅ Qwen-7B</span>
            </div>
          </div>
          
          <button class="button" onclick="alert('Fonctionnalité en développement')">Nouvelle Investigation</button>
          <button class="button" onclick="alert('Fonctionnalité en développement')">Outils OSINT</button>
          <button class="button" onclick="alert('Fonctionnalité en développement')">Rapports</button>
          <button class="button" onclick="alert('Fonctionnalité en développement')">Configuration</button>
        </div>
        
        <div class="version">AURA OSINT v1.0.0</div>
      </body>
      </html>
    `));
    
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });
  }

  registerProtocolHandlers() {
    protocol.registerFileProtocol('aura', (request, callback) => {
      const url = request.url.replace('aura://', '');
      const [page] = url.split('?');
      
      const routes = {
        'dashboard': 'pages/dashboard.html',
        'investigations': 'pages/investigations.html',
        'tools': 'pages/tools.html',
        'settings': 'pages/settings.html'
      };

      const route = routes[page] || 'pages/dashboard.html';
      const filePath = path.join(__dirname, 'frontend-embedded', route);

      callback({ path: filePath });
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
  console.error('❌ Erreur critique lors de l\'initialisation:', error);
  app.quit();
});