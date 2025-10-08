const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cluster = require('cluster');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 3002;
const CLUSTER_MODE = process.env.CLUSTER_MODE === 'true';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Interface Analyser TikTok
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TikTok Analyser - SCIS</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%);
                color: white;
                min-height: 100vh;
                padding: 40px 20px;
            }
            .container { max-width: 1000px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { 
                font-size: 2.5rem; 
                color: #25F4EE;
                margin-bottom: 10px;
            }
            .card { 
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
            }
            .form-group { margin-bottom: 20px; }
            .form-label { display: block; margin-bottom: 8px; color: #25F4EE; }
            .form-input { 
                width: 100%; 
                padding: 12px; 
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 16px;
            }
            .btn { 
                background: linear-gradient(90deg, #FF0050, #25F4EE);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .btn:hover { transform: translateY(-2px); }
            .status { 
                padding: 10px 20px;
                border-radius: 20px;
                margin: 10px 0;
                text-align: center;
            }
            .status.connected { background: rgba(0, 255, 0, 0.2); color: #00ff00; }
            .status.disconnected { background: rgba(255, 0, 0, 0.2); color: #ff0000; }
            .live-data { 
                max-height: 400px; 
                overflow-y: auto; 
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                padding: 20px;
            }
            .data-item { 
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                border-left: 4px solid #25F4EE;
            }
        </style>
        <script src="/socket.io/socket.io.js"></script>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">📡 TikTok Live Analyser</h1>
                <p style="color: #B0B0B0;">Service d'analyse en temps réel - Port 3002</p>
            </div>

            <div class="card">
                <h3 style="color: #25F4EE; margin-bottom: 20px;">Configuration de l'Analyse</h3>
                <div class="form-group">
                    <label class="form-label">URL du Live TikTok</label>
                    <input type="text" class="form-input" id="liveUrl" 
                           placeholder="https://www.tiktok.com/@username/live" 
                           value="https://www.tiktok.com/@titilepirate3/live">
                </div>
                <div class="form-group">
                    <label class="form-label">Titre de la Session</label>
                    <input type="text" class="form-input" id="sessionTitle" 
                           placeholder="Session d'analyse TikTok">
                </div>
                <button class="btn" onclick="startAnalysis()">🚀 Démarrer l'Analyse</button>
                <button class="btn" onclick="stopAnalysis()" style="background: #FF0050; margin-left: 10px;">🛑 Arrêter</button>
            </div>

            <div class="card">
                <h3 style="color: #25F4EE; margin-bottom: 20px;">Statut de Connexion</h3>
                <div id="connectionStatus" class="status disconnected">🔴 Déconnecté</div>
            </div>

            <div class="card">
                <h3 style="color: #25F4EE; margin-bottom: 20px;">Données Live</h3>
                <div id="liveData" class="live-data">
                    <p style="text-align: center; color: #666;">En attente de données...</p>
                </div>
            </div>
        </div>

        <script>
            const socket = io();
            let isAnalyzing = false;

            socket.on('connect', () => {
                document.getElementById('connectionStatus').innerHTML = '🟢 Connecté';
                document.getElementById('connectionStatus').className = 'status connected';
            });

            socket.on('disconnect', () => {
                document.getElementById('connectionStatus').innerHTML = '🔴 Déconnecté';
                document.getElementById('connectionStatus').className = 'status disconnected';
            });

            socket.on('liveData', (data) => {
                const liveDataDiv = document.getElementById('liveData');
                const dataItem = document.createElement('div');
                dataItem.className = 'data-item';
                dataItem.innerHTML = \`
                    <strong>\${data.type}</strong> - \${data.timestamp}<br>
                    <span style="color: #25F4EE;">\${data.user || 'Système'}</span>: \${data.content || data.message}
                \`;
                liveDataDiv.insertBefore(dataItem, liveDataDiv.firstChild);
                
                // Limiter à 50 éléments
                while (liveDataDiv.children.length > 50) {
                    liveDataDiv.removeChild(liveDataDiv.lastChild);
                }
            });

            function startAnalysis() {
                const url = document.getElementById('liveUrl').value;
                const title = document.getElementById('sessionTitle').value;
                
                if (!url) {
                    alert('Veuillez saisir une URL de live TikTok');
                    return;
                }

                socket.emit('startAnalysis', { url, title });
                isAnalyzing = true;
                
                // Simuler des données pour la démo
                setInterval(() => {
                    if (isAnalyzing) {
                        socket.emit('liveData', {
                            type: 'comment',
                            user: 'User' + Math.floor(Math.random() * 1000),
                            content: 'Message de test ' + Math.floor(Math.random() * 100),
                            timestamp: new Date().toLocaleTimeString()
                        });
                    }
                }, 2000);
            }

            function stopAnalysis() {
                socket.emit('stopAnalysis');
                isAnalyzing = false;
            }
        </script>
    </body>
    </html>
  `);
});

// API endpoints
app.post('/api/start-analysis', (req, res) => {
  const { url, title } = req.body;
  console.log(`🚀 Starting analysis for: ${url}`);
  res.json({ success: true, message: 'Analysis started', url, title });
});

app.post('/api/stop-analysis', (req, res) => {
  console.log('🛑 Stopping analysis');
  res.json({ success: true, message: 'Analysis stopped' });
});

// Socket.IO pour temps réel
io.on('connection', (socket) => {
  console.log('📡 Client connected to Analyser service');
  
  socket.on('startAnalysis', (data) => {
    console.log('Starting analysis:', data);
    socket.emit('liveData', {
      type: 'system',
      message: `Analyse démarrée pour ${data.url}`,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on('stopAnalysis', () => {
    console.log('Stopping analysis');
    socket.emit('liveData', {
      type: 'system',
      message: 'Analyse arrêtée',
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    console.log('📡 Client disconnected from Analyser service');
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    service: 'analyser', 
    status: 'healthy', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

server.listen(PORT, () => {
  console.log(`📡 TikTok Analyser Service running on port ${PORT}`);
});

module.exports = app;