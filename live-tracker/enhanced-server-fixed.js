const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const winston = require('winston');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], 
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true
});

// Configuration directe
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

// Logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Database
const db = new Pool(config.database);

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes API basiques
let apiRoutes, stealthRoutes;
try {
  apiRoutes = require('./api-routes-complete');
  app.use('/api', apiRoutes);
} catch (e) {
  console.log('API routes non disponibles');
}

try {
  stealthRoutes = require('./stealth-routes');
  app.use('/api/stealth', stealthRoutes);
} catch (e) {
  console.log('Stealth routes non disponibles');
}

// Routes de base
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

// Route pour les rapports
app.get('/api/reports/summary', async (req, res) => {
  try {
    const stats = {
      total_profiles: 0,
      total_sessions: 0,
      total_comments: 0,
      total_gifts: 0,
      active_sessions: 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Variables globales
const activeSessions = new Map();
let dataPipeline, browserInterceptor;

// Initialisation DB
async function initializeDatabase() {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Base de données connectée');
  } catch (error) {
    console.error('❌ Erreur DB:', error.message);
  }
}

setTimeout(initializeDatabase, 2000);

// Socket.IO
io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// Démarrage serveur
const PORT = config.servers.backend.port;
server.listen(PORT, () => {
  logger.info('Enhanced server started', { port: PORT });
  console.log(`🚀 AURA Server - Port ${PORT}`);
  console.log('📱 Launcher: http://localhost:3000');
});

// Nettoyage
process.on('SIGINT', async () => {
  logger.info('Shutting down server');
  await db.end();
  process.exit(0);
});

module.exports = { app, server, io, db };