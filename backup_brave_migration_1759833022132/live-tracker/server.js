const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const puppeteer = require('puppeteer');
const { Pool } = require('pg');
const winston = require('winston');
const crypto = require('crypto');

// Configuration
const PORT = 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// Logger forensic
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'evidence.log' }),
    new winston.transports.Console()
  ]
});

// Database connection
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'live_tracker',
  password: 'Mohand/06',
  port: 5432,
});

// Variables globales sécurisées
const activeSessions = new Map();

// Script d'extraction TikTok optimisé
const TIKTOK_EXTRACTOR = `
(function() {
    console.log('🎯 LIVE TRACKER PRO - Extraction activée');
    
    let messageCount = 0;
    
    // Fonction de hash pour intégrité
    function hashData(data) {
        return btoa(JSON.stringify(data) + Date.now());
    }
    
    // Intercepteur WebSocket TikTok
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new originalWebSocket(url, protocols);
        
        ws.addEventListener('message', function(event) {
            try {
                const rawData = JSON.parse(event.data);
                messageCount++;
                
                // Commentaires
                if (rawData.type === 'msg' && rawData.data) {
                    const comment = {
                        type: 'comment',
                        hash: hashData(rawData.data),
                        user_id: rawData.data.user_id,
                        unique_id: rawData.data.unique_id,
                        nickname: rawData.data.nickname,
                        content: rawData.data.content,
                        create_time: rawData.data.create_time,
                        profile_picture_url: rawData.data.avatar_thumb?.url_list?.[0],
                        is_moderator: (rawData.data.user_badge_list || []).some(b => b.type === 'moderator'),
                        is_owner: (rawData.data.user_badge_list || []).some(b => b.type === 'owner'),
                        is_vip: (rawData.data.user_badge_list || []).some(b => b.type === 'vip'),
                        captured_at: Date.now(),
                        message_sequence: messageCount
                    };
                    window.sendToTracker(comment);
                }
                
                // Cadeaux
                if (rawData.type === 'gift' && rawData.data) {
                    const gift = {
                        type: 'gift',
                        hash: hashData(rawData.data),
                        gift_id: rawData.data.gift?.id,
                        gift_name: rawData.data.gift?.name,
                        gift_count: rawData.data.repeat_count || 1,
                        gift_price: rawData.data.gift?.diamond_count,
                        sender_user_id: rawData.data.user?.user_id,
                        sender_unique_id: rawData.data.user?.unique_id,
                        sender_nickname: rawData.data.user?.nickname,
                        captured_at: Date.now(),
                        message_sequence: messageCount
                    };
                    window.sendToTracker(gift);
                }
                
                // Statistiques room
                if (rawData.type === 'member' || rawData.type === 'room_user_seq') {
                    const stats = {
                        type: 'room_stats',
                        viewer_count: rawData.data?.total_user || rawData.data?.total || 0,
                        like_count: rawData.data?.like_count || 0,
                        captured_at: Date.now()
                    };
                    window.sendToTracker(stats);
                }
                
            } catch (e) {
                console.error('Erreur parsing:', e);
            }
        });
        
        return ws;
    };
    
    console.log('✅ Extracteur TikTok prêt - Messages interceptés:', messageCount);
})();
`;

// Fonction de démarrage de session
async function startTracking(sessionId, liveUrl) {
    try {
        logger.info('Démarrage session', { sessionId, liveUrl });
        
        // Lancer Brave avec profil utilisateur
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/brave-browser',
            headless: false,
            userDataDir: process.env.HOME + '/.config/BraveSoftware/Brave-Browser',
            args: ['--no-first-run', '--disable-web-security']
        });
        
        const page = await browser.newPage();
        
        // Exposer fonction de réception
        await page.exposeFunction('sendToTracker', async (data) => {
            await processData(sessionId, data);
        });
        
        // Injecter extracteur
        await page.evaluateOnNewDocument(TIKTOK_EXTRACTOR);
        
        // Naviguer vers live
        await page.goto(liveUrl, { waitUntil: 'networkidle0' });
        
        // Stocker session
        activeSessions.set(sessionId, {
            browser,
            page,
            liveUrl,
            startTime: Date.now(),
            dataCount: 0
        });
        
        logger.info('Session active', { sessionId });
        return { success: true, sessionId };
        
    } catch (error) {
        logger.error('Erreur démarrage', { sessionId, error: error.message });
        throw error;
    }
}

// Traitement des données avec intégrité forensic
async function processData(sessionId, data) {
    try {
        const session = activeSessions.get(sessionId);
        if (!session) return;
        
        session.dataCount++;
        
        // Hash d'intégrité
        const evidenceHash = crypto.createHash('sha256')
            .update(JSON.stringify(data) + sessionId + Date.now())
            .digest('hex');
        
        // Sauvegarder en base
        if (data.type === 'comment') {
            await db.query(`
                INSERT INTO comments (
                    session_id, evidence_hash, user_id, unique_id, nickname, 
                    content, create_time, is_moderator, is_owner, is_vip,
                    profile_picture_url, captured_at, message_sequence
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `, [
                sessionId, evidenceHash, data.user_id, data.unique_id, 
                data.nickname, data.content, new Date(data.create_time),
                data.is_moderator, data.is_owner, data.is_vip,
                data.profile_picture_url, new Date(data.captured_at), data.message_sequence
            ]);
        }
        
        if (data.type === 'gift') {
            await db.query(`
                INSERT INTO gifts (
                    session_id, evidence_hash, gift_id, gift_name, gift_count,
                    gift_price, sender_user_id, sender_unique_id, sender_nickname,
                    captured_at, message_sequence
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [
                sessionId, evidenceHash, data.gift_id, data.gift_name, data.gift_count,
                data.gift_price, data.sender_user_id, data.sender_unique_id, 
                data.sender_nickname, new Date(data.captured_at), data.message_sequence
            ]);
        }
        
        // Envoyer au frontend
        io.emit('liveData', { sessionId, data, evidenceHash });
        
        logger.info('Données traitées', { 
            sessionId, 
            type: data.type, 
            evidenceHash,
            totalCount: session.dataCount 
        });
        
    } catch (error) {
        logger.error('Erreur traitement données', { sessionId, error: error.message });
    }
}

// Arrêt de session
async function stopTracking(sessionId) {
    try {
        const session = activeSessions.get(sessionId);
        if (!session) return { success: false, message: 'Session introuvable' };
        
        await session.browser.close();
        activeSessions.delete(sessionId);
        
        // Mettre à jour en base
        await db.query(
            'UPDATE sessions SET ended_at = NOW(), data_count = $1 WHERE id = $2',
            [session.dataCount, sessionId]
        );
        
        logger.info('Session fermée', { sessionId, dataCount: session.dataCount });
        return { success: true, dataCount: session.dataCount };
        
    } catch (error) {
        logger.error('Erreur arrêt session', { sessionId, error: error.message });
        throw error;
    }
}

// Routes API
app.use(express.json());
app.use(require('cors')());

app.post('/api/sessions', async (req, res) => {
    try {
        const { liveUrl, title } = req.body;
        
        // Créer session en base
        const result = await db.query(`
            INSERT INTO sessions (live_url, title, started_at) 
            VALUES ($1, $2, NOW()) 
            RETURNING id, live_url, title, started_at
        `, [liveUrl, title || 'Live TikTok']);
        
        const session = result.rows[0];
        
        // Démarrer tracking
        await startTracking(session.id, liveUrl);
        
        res.json({ success: true, session });
        
    } catch (error) {
        logger.error('Erreur création session', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/sessions/:id', async (req, res) => {
    try {
        const sessionId = req.params.id;
        const result = await stopTracking(sessionId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sessions', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT s.*, 
                   COUNT(c.id) as comment_count,
                   COUNT(g.id) as gift_count
            FROM sessions s
            LEFT JOIN comments c ON s.id = c.session_id
            LEFT JOIN gifts g ON s.id = g.session_id
            GROUP BY s.id
            ORDER BY s.started_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Socket.IO
io.on('connection', (socket) => {
    logger.info('Client connecté', { socketId: socket.id });
    
    socket.on('disconnect', () => {
        logger.info('Client déconnecté', { socketId: socket.id });
    });
});

// Démarrage serveur
server.listen(PORT, () => {
    logger.info('LIVE TRACKER PRO démarré', { port: PORT });
    console.log(`🚀 LIVE TRACKER PRO - Port ${PORT}`);
    console.log('📱 Frontend: http://localhost:3000');
});

// Nettoyage à la fermeture
process.on('SIGINT', async () => {
    logger.info('Arrêt système');
    for (const [sessionId] of activeSessions) {
        await stopTracking(sessionId);
    }
    process.exit(0);
});