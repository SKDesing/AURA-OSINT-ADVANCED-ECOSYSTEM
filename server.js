const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8888;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes de base
app.get('/', (req, res) => {
  res.json({
    name: 'AURA OSINT Advanced Ecosystem',
    version: '2.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 AURA OSINT Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;