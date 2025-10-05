const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const winston = require('winston');
const cors = require('cors');
const { TikTokForensicScraper } = require('./tiktok-scraper-advanced');
const config = require('../config');

// Import des nouvelles routes
const profilesRouter = require('./api/routes/profiles');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
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

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/profiles', profilesRouter);

// Variables globales
const activeSessions = new Map();
const scraperInstances = new Map();

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
  console.log('📱 Frontend: http://localhost:3000');
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