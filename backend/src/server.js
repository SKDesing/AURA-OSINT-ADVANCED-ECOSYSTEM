import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import { Client } from 'minio';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// MinIO client
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
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
  const { username, content, timestamp } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (session_id, username, content, timestamp) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, username, content, timestamp]
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
  console.log('AURA Backend running on port 3000');
});