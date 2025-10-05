const express = require('express');
const cors = require('cors');
const redis = require('redis');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

// Rate limiting pour API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use('/api/', limiter);

// Connexion Redis
redisClient.connect().catch(console.error);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'profiles',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/profiles', (req, res) => {
  res.json({
    message: 'Service Profiles SCIS',
    status: 'active',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🔍 Service Profiles SCIS démarré sur le port ${PORT}`);
});