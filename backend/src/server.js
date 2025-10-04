import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import { Client } from 'minio';
import pkg from 'pg';
const { Pool } = pkg;
import exportRoutes from './routes/export.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use('/api', exportRoutes);

const upload = multer({ storage: multer.memoryStorage() });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aura_user:secure_password@localhost:5433/aura_investigations'
});

// MinIO client
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

// Route racine pour éviter 404
app.get('/', (req, res) => {
  res.json({ 
    message: 'AURA Backend API', 
    version: '1.0.0',
    endpoints: ['/api/sessions', '/api/sessions/:id/comments', '/api/sessions/:id/export/json']
  });
});

// Routes
app.post('/api/sessions', async (req, res) => {
  const { url, title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sessions (url, title, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [url, title]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sessions/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { username, unique_id, content, timestamp, user_id, avatar_url, is_moderator, is_owner, is_vip, follower_count, following_count, badges, gift_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (session_id, username, unique_id, content, timestamp, user_id, avatar_url, is_moderator, is_owner, is_vip, follower_count, following_count, badges, gift_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [id, username, unique_id, content, timestamp, user_id, avatar_url, is_moderator, is_owner, is_vip, follower_count, following_count, JSON.stringify(badges), gift_id]
    );
    io.emit('new-comment', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sessions/:id/video', upload.single('video'), async (req, res) => {
  const { id } = req.params;
  const videoBuffer = req.file.buffer;
  const fileName = `session-${id}-${Date.now()}.webm`;
  
  try {
    await minioClient.putObject('videos', fileName, videoBuffer);
    await pool.query(
      'UPDATE sessions SET video_url = $1 WHERE id = $2',
      [fileName, id]
    );
    res.json({ videoUrl: fileName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sessions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(3000, () => {
  console.log('✅ AURA Backend running on port 3000');
  console.log('📡 API endpoints: http://localhost:3000/api/sessions');
});