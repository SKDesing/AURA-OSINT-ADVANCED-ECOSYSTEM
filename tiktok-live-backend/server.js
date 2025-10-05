require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const puppeteer = require('puppeteer');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tiktok_live',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Variables globales
let browser;
let page;
let currentSession = null;

// Script d'injection pour capturer les WebSockets TikTok
const injectionScript = `
(function() {
    console.log("🎯 Chimera Agent: Injection réussie");
    
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        
        ws.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                
                // Intercepter les commentaires
                if (data.type === 'msg' && data.data?.content) {
                    window.sendDataToBackend({
                        type: 'comment',
                        payload: {
                            id: data.data.id || Date.now(),
                            username: data.data.nickname || data.data.unique_id,
                            unique_id: data.data.unique_id,
                            content: data.data.content,
                            timestamp: data.data.create_time || Date.now(),
                            user_id: data.data.user_id,
                            is_moderator: data.data.user_badge_list?.some(b => b.type === 'moderator') || false,
                            is_owner: data.data.user_badge_list?.some(b => b.type === 'owner') || false,
                            is_vip: data.data.user_badge_list?.some(b => b.type === 'vip') || false,
                            avatar_url: data.data.avatar_thumb?.url_list?.[0]
                        }
                    });
                }
                
                // Intercepter les cadeaux
                if (data.type === 'gift') {
                    window.sendDataToBackend({
                        type: 'gift',
                        payload: {
                            gift_name: data.data.gift?.name,
                            sender: data.data.user?.nickname,
                            repeat_count: data.data.repeat_count || 1
                        }
                    });
                }
                
                // Intercepter le nombre de spectateurs
                if (data.type === 'member' || data.type === 'room_user_seq') {
                    window.sendDataToBackend({
                        type: 'viewers',
                        payload: {
                            count: data.data.total_user || data.data.total || 0
                        }
                    });
                }
                
            } catch (e) {
                // Ignore les messages non-JSON
            }
        });
        
        return ws;
    };
})();
`;

// Fonction pour démarrer la capture
async function startCapture(liveUrl) {
    try {
        console.log(`🎬 Démarrage capture: ${liveUrl}`);
        
        // Créer une session en base
        const sessionResult = await pool.query(
            'INSERT INTO capture_sessions (live_url, streamer_username, started_at) VALUES ($1, $2, NOW()) RETURNING *',
            [liveUrl, extractUsername(liveUrl)]
        );
        currentSession = sessionResult.rows[0];
        
        // Lancer Brave avec Puppeteer
        browser = await puppeteer.launch({
            executablePath: '/snap/bin/brave',
            headless: false,
            userDataDir: '/tmp/brave-tiktok-capture',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        
        page = await browser.newPage();
        
        // Exposer la fonction pour recevoir les données
        await page.exposeFunction('sendDataToBackend', async (data) => {
            console.log(`📊 ${data.type}:`, data.payload);
            
            if (data.type === 'comment') {
                await saveComment(data.payload);
                io.emit('newComment', {
                    username: data.payload.username,
                    comment: data.payload.content,
                    timestamp: new Date().toISOString(),
                    is_moderator: data.payload.is_moderator,
                    is_owner: data.payload.is_owner,
                    is_vip: data.payload.is_vip
                });
            }
            
            if (data.type === 'gift') {
                io.emit('newGift', data.payload);
            }
            
            if (data.type === 'viewers') {
                io.emit('viewerCount', data.payload);
            }
        });
        
        // Injecter le script de capture
        await page.evaluateOnNewDocument(injectionScript);
        
        // Naviguer vers le live
        await page.goto(liveUrl, { waitUntil: 'networkidle2' });
        
        console.log('✅ Capture active !');
        
    } catch (error) {
        console.error('❌ Erreur capture:', error);
        throw error;
    }
}

// Sauvegarder un commentaire en base
async function saveComment(commentData) {
    try {
        // Insérer ou mettre à jour l'utilisateur
        await pool.query(`
            INSERT INTO users (id, unique_id, nickname, is_vip, is_mod) 
            VALUES ($1, $2, $3, $4, $5) 
            ON CONFLICT (id) DO UPDATE SET 
                nickname = EXCLUDED.nickname,
                is_vip = EXCLUDED.is_vip,
                is_mod = EXCLUDED.is_mod
        `, [
            commentData.user_id || Date.now(),
            commentData.unique_id,
            commentData.username,
            commentData.is_vip,
            commentData.is_moderator
        ]);
        
        // Insérer le commentaire
        await pool.query(`
            INSERT INTO comments (tiktok_comment_id, session_id, user_id, content, created_at) 
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (tiktok_comment_id) DO NOTHING
        `, [
            commentData.id,
            currentSession.id,
            commentData.user_id || Date.now(),
            commentData.content,
            new Date(commentData.timestamp)
        ]);
        
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
    }
}

// Extraire le nom d'utilisateur de l'URL
function extractUsername(url) {
    const match = url.match(/@([^/]+)/);
    return match ? match[1] : 'unknown';
}

// Arrêter la capture
async function stopCapture() {
    if (browser) {
        await browser.close();
        browser = null;
        page = null;
    }
    
    if (currentSession) {
        await pool.query(
            'UPDATE capture_sessions SET ended_at = NOW() WHERE id = $1',
            [currentSession.id]
        );
        currentSession = null;
    }
    
    console.log('🛑 Capture arrêtée');
}

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
    console.log('🔗 Client connecté');
    
    socket.on('startCapture', async (url) => {
        try {
            await startCapture(url);
            socket.emit('captureStarted', { success: true });
        } catch (error) {
            socket.emit('captureError', { error: error.message });
        }
    });
    
    socket.on('stopCapture', async () => {
        await stopCapture();
        socket.emit('captureStopped');
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Client déconnecté');
    });
});

// Routes API
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'running',
        session: currentSession ? currentSession.id : null
    });
});

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`🚀 Serveur Chimera démarré sur le port ${PORT}`);
    console.log(`🎯 Interface React: http://localhost:3000`);
    console.log(`📡 Backend API: http://localhost:${PORT}`);
});

// Nettoyage à la fermeture
process.on('SIGINT', async () => {
    console.log('\n🧹 Nettoyage...');
    await stopCapture();
    process.exit(0);
});