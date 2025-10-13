const http = require('http');

const express = require('express');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const winston = require('winston');
const cors = require('cors');

const { TikTokForensicScraper } = require('./tiktok-scraper-advanced');
// Configuration directe pour éviter les erreurs
const config = {
  database: {
    host: 'localhost',
    port: 5432,
    database: 'live_tracker',
    user: 'postgres',
    password: 'Mohand/06'
  },
  servers: {
    backend: { port: 3000 }
  },
  logging: {
    level: 'info',
    files: { main: './logs/app.log' }
  }
};
const BraveLauncher = require('./brave-launcher');
const BrowserInterceptor = require('./browser-interceptor');
const DataPipeline = require('./data-pipeline');

// Import des nouvelles routes
const profilesRouter = require('./api/routes/profiles');
const networkRoutes = require('./network-routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: ["http://localhost:XXXX", "http://127.0.0.1:XXXX"], 
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true
});

// Logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: config.logging.files.main }),
    new winston.transports.Console()
  ]
});

// Database
const db = new Pool(config.database);

// Middleware CORS complet
app.use(cors({
  origin: ['http://localhost:XXXX', 'http://127.0.0.1:XXXX'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Headers CORS supplémentaires
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:XXXX');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes API complètes
const apiRoutes = require('./api-routes-complete');
const stealthRoutes = require('./stealth-routes');
app.use('/api', apiRoutes);
app.use('/api/stealth', stealthRoutes);
app.use('/api/profiles', profilesRouter);
app.use('/api/network', networkRoutes);

// Route pour lancer Brave
app.post('/api/launch-brave', async (req, res) => {
  try {
    const launcher = new BraveLauncher();
    const result = await launcher.launchSeparateWindows();
    res.json(result);
  } catch (error) {
    logger.error('Error launching Brave', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Route pour capturer les données du navigateur
app.post('/api/capture', async (req, res) => {
  try {
    const { type, data, token } = req.body;
    
    // Vérifier le token de sécurité (si disponible)
    if (token && !token.startsWith('AURA_')) {
      logger.warn('Invalid security token detected', { token });
      return res.status(403).json({ error: 'Invalid security token' });
    }
    
    switch (type) {
      case 'AURA_COMMENT':
      case 'AURA_COMMENT_DOM':
        if (dataPipeline) await dataPipeline.processComment(data);
        break;
      case 'AURA_GIFT':
        if (dataPipeline) await dataPipeline.processGift(data);
        break;
      case 'AURA_STATS':
        if (dataPipeline) await dataPipeline.processStats(data);
        break;
      case 'AURA_UNKNOWN':
        // Logger les messages inconnus pour analyse
        const ForensicLogger = require('./forensic-logger');
        const forensicLogger = new ForensicLogger();
        await forensicLogger.logUnknownMessage(data);
        break;
    }
    
    // Diffuser en temps réel via WebSocket
    io.emit('live-data', { type, data });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing captured data', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Route pour démarrer une session de capture
app.post('/api/capture/start', async (req, res) => {
  try {
    const { liveUrl, title } = req.body;
    const sessionId = await dataPipeline.startSession(liveUrl, title);
    res.json({ success: true, sessionId });
  } catch (error) {
    logger.error('Error starting capture session', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Route pour arrêter une session de capture
app.post('/api/capture/stop', async (req, res) => {
  try {
    await dataPipeline.stopSession();
    res.json({ success: true });
  } catch (error) {
    logger.error('Error stopping capture session', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Variables globales
const activeSessions = new Map();
const scraperInstances = new Map();
let dataPipeline;
let browserInterceptor;

// Initialiser la base de données
async function initializeDatabase() {
  try {
    // Vérifier la connexion
    await db.query('SELECT NOW()');
    console.log('✅ Base de données connectée');
    
    // Initialiser les modules
    dataPipeline = new DataPipeline();
    browserInterceptor = new BrowserInterceptor();
    console.log('✅ Modules de capture initialisés');
  } catch (error) {
    console.error('❌ Erreur initialisation DB:', error.message);
  }
}

// Initialiser après 2 secondes
setTimeout(initializeDatabase, 2000);

// Route de scraping (conservée pour compatibilité)
app.post('/api/profiles/scrape', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username requis' });
    }

    const scraper = new TikTokForensicScraper();
    scraperInstances.set(username, scraper);
    
    await scraper.initialize();
    const profileData = await scraper.scrapeProfile(username);
    
    // Sauvegarder avec la nouvelle structure
    await db.query(`
      INSERT INTO profils_tiktok (
        unique_id, user_id, nom_affiche, bio, verifie, follower_count,
        following_count, video_count, heart_count, url_photo_profil,
        hash_preuve, methode_collecte
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (unique_id) DO UPDATE SET
        nom_affiche = EXCLUDED.nom_affiche,
        bio = EXCLUDED.bio,
        verifie = EXCLUDED.verifie,
        follower_count = EXCLUDED.follower_count,
        following_count = EXCLUDED.following_count,
        video_count = EXCLUDED.video_count,
        heart_count = EXCLUDED.heart_count,
        url_photo_profil = EXCLUDED.url_photo_profil,
        hash_preuve = EXCLUDED.hash_preuve,
        updated_at = NOW()
    `, [
      profileData.username,
      profileData.userId || Math.floor(Math.random() * 1000000000000000000),
      profileData.displayName,
      profileData.bio,
      profileData.verified,
      profileData.followerCount,
      profileData.followingCount,
      profileData.videoCount,
      profileData.heartCount,
      profileData.profilePicUrl,
      profileData.evidenceHash,
      'automated'
    ]);

    await scraper.close();
    scraperInstances.delete(username);
    
    logger.info('Profile scraped successfully', { username });
    res.json({ success: true, profileData });
    
  } catch (error) {
    logger.error('Profile scraping failed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Routes pour l'exploration de base de données
app.get('/api/database/tables', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/database/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const limit = req.query.limit || 100;
    
    // Validation basique du nom de table
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      return res.status(400).json({ error: 'Nom de table invalide' });
    }
    
    const result = await db.query(`SELECT * FROM ${tableName} LIMIT $1`, [limit]);
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/database/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Validation basique - seulement SELECT autorisé
    if (!query.trim().toLowerCase().startsWith('select')) {
      return res.status(400).json({ error: 'Seules les requêtes SELECT sont autorisées' });
    }
    
    const result = await db.query(query);
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes pour les sessions live (existantes)
app.post('/api/sessions', async (req, res) => {
  try {
    const { liveUrl, title } = req.body;
    
    const result = await db.query(`
      INSERT INTO sessions (live_url, title, started_at) 
      VALUES ($1, $2, NOW()) 
      RETURNING id, live_url, title, started_at
    `, [liveUrl, title || 'Live TikTok']);
    
    const session = result.rows[0];
    res.json({ success: true, session });
    
  } catch (error) {
    logger.error('Error creating session', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, 
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT g.id) as gift_count
      FROM sessions s
      LEFT JOIN comments c ON s.id = c.session_id
      LEFT JOIN gifts g ON s.id = g.session_id
      GROUP BY s.id
      ORDER BY s.started_at DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    await db.query('UPDATE sessions SET ended_at = NOW() WHERE id = $1', [sessionId]);
    
    if (activeSessions.has(sessionId)) {
      activeSessions.delete(sessionId);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes pour les rapports
app.get('/api/reports/summary', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM profils_tiktok) as total_profiles,
        (SELECT COUNT(*) FROM live_sessions) as total_sessions,
        (SELECT COUNT(*) FROM live_commentaires) as total_comments,
        (SELECT COUNT(*) FROM live_cadeaux) as total_gifts,
        (SELECT COUNT(*) FROM live_sessions WHERE end_timestamp IS NULL) as active_sessions
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'AURA Stealth API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Socket.IO
io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// Démarrage du serveur
const PORT = config.servers.backend.port;
server.listen(PORT, () => {
  logger.info('Enhanced server started', { port: PORT });
  console.log(`🚀 Enhanced Server - Port ${PORT}`);
  console.log('📱 Frontend: http://localhost:XXXX');
});

// Nettoyage à la fermeture
process.on('SIGINT', async () => {
  logger.info('Shutting down server');
  
  // Fermer toutes les instances de scraper
  for (const [username, scraper] of scraperInstances) {
    try {
      await scraper.close();
      logger.info('Scraper closed', { username });
    } catch (error) {
      logger.error('Error closing scraper', { username, error: error.message });
    }
  }
  
  await db.end();
  process.exit(0);
});

module.exports = { app, server, io, db };