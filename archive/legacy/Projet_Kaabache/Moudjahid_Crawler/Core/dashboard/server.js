const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API pour les statistiques dynamiques
app.get('/api/stats', async (req, res) => {
  try {
    // Simulation de récupération de données réelles
    // En production, ces données viendraient de la base PostgreSQL
    const stats = {
      servicesActifs: 7,
      profilsAnalyses: 12,
      tablesForensiques: 17,
      disponibilite: '100%'
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les statistiques' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'dashboard', 
    status: 'healthy', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🎯 Dashboard Service running on port ${PORT}`);
});

module.exports = app;