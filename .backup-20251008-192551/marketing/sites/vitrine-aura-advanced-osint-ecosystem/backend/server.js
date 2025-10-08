const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sendEmail = require('./api/send-email');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Sécurité
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 emails max par IP
  message: {
    success: false,
    error: 'Trop de tentatives. Réessayez dans 15 minutes.'
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aura-osint.com', 'https://www.aura-osint.com']
    : ['http://localhost:XXXX', 'http://localhost:XXXX']
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/api/send-email', limiter, sendEmail);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AURA Backend API - Opérationnel',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Erreur serveur:', error);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

app.listen(PORT, () => {
  console.log(`✅ AURA Backend démarré sur http://localhost:XXXX${PORT}`);
  console.log(`📧 Mailtrap: ${process.env.MAILTRAP_HOST ? 'Configuré' : 'Non configuré'}`);
});