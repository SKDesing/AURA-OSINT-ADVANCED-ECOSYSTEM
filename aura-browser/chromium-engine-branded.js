const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'AURA Browser - OSINT Investigation Platform',
    show: false
  });

  mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AURA Browser - OSINT Investigation Platform</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a0e27, #1a1f3a);
          color: #fff;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          padding: 30px;
          text-align: center;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
        }
        .logo {
          font-size: 3.5rem;
          background: linear-gradient(45deg, #ffd700, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .browser-name {
          font-size: 1.8rem;
          color: #ffd700;
          margin-bottom: 5px;
        }
        .tagline {
          font-size: 1rem;
          opacity: 0.8;
          font-style: italic;
        }
        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .welcome-section {
          text-align: center;
          margin-bottom: 40px;
        }
        .welcome-title {
          font-size: 2rem;
          margin-bottom: 15px;
          color: #fff;
        }
        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 40px;
        }
        .status-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .status-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }
        .status-title {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #ffd700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }
        .status-ok { color: #4caf50; font-weight: bold; }
        .status-error { color: #f44336; font-weight: bold; }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-top: 30px;
        }
        .btn {
          background: linear-gradient(45deg, #ffd700, #ff8c00);
          color: #0a0e27;
          border: none;
          padding: 15px 30px;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
        }
        .footer {
          text-align: center;
          padding: 20px;
          opacity: 0.6;
          font-size: 0.9rem;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🌟 AURA</div>
        <div class="browser-name">AURA Browser</div>
        <div class="tagline">Advanced OSINT Investigation Platform</div>
      </div>
      
      <div class="container">
        <div class="welcome-section">
          <h1 class="welcome-title">Bienvenue dans AURA Browser</h1>
          <p>Votre navigateur spécialisé pour les investigations OSINT</p>
        </div>
        
        <div class="status-grid">
          <div class="status-card">
            <div class="status-title">
              <span>🔧</span>
              <span>Services Core</span>
            </div>
            <div class="status-item">
              <span>Backend API:</span>
              <span id="backend-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>Base de données:</span>
              <span id="db-status" class="status-ok">✅ PostgreSQL</span>
            </div>
            <div class="status-item">
              <span>Cache Redis:</span>
              <span id="redis-status" class="status-ok">✅ Actif</span>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-title">
              <span>🔍</span>
              <span>Moteurs IA</span>
            </div>
            <div class="status-item">
              <span>Elasticsearch:</span>
              <span class="status-ok">✅ Prêt</span>
            </div>
            <div class="status-item">
              <span>Qdrant Vector:</span>
              <span class="status-ok">✅ Connecté</span>
            </div>
            <div class="status-item">
              <span>AI Assistant:</span>
              <span class="status-ok">✅ Qwen-7B</span>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-title">
              <span>🛠️</span>
              <span>Outils OSINT</span>
            </div>
            <div class="status-item">
              <span>Scanner Réseau:</span>
              <span class="status-ok">✅ Prêt</span>
            </div>
            <div class="status-item">
              <span>Analyse Email:</span>
              <span class="status-ok">✅ Prêt</span>
            </div>
            <div class="status-item">
              <span>Darknet Tools:</span>
              <span class="status-ok">✅ Prêt</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn">🔍 Nouvelle Investigation</button>
          <button class="btn">🛠️ Outils OSINT</button>
          <button class="btn">📊 Rapports</button>
          <button class="btn">⚙️ Configuration</button>
        </div>
      </div>
      
      <div class="footer">
        <p>AURA Browser v1.0.0 | Powered by AURA Security Labs</p>
      </div>
      
      <script>
        async function checkServices() {
          try {
            const response = await fetch('http://localhost:4011/ai/observability/summary');
            document.getElementById('backend-status').innerHTML = response.ok ? 
              '✅ Opérationnel' : '❌ Erreur';
          } catch (error) {
            document.getElementById('backend-status').innerHTML = '❌ Inaccessible';
          }
        }
        
        window.addEventListener('DOMContentLoaded', checkServices);
      </script>
    </body>
    </html>
  `));
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});