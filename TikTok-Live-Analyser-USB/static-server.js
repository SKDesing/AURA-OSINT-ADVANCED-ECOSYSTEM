const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS pour toutes les origines
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir les fichiers statiques du frontend-build
app.use(express.static(path.join(__dirname, 'frontend-build')));

// Route pour l'interface OSINT
app.get('/osint-tools.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'osint-tools.html'));
});

// Route par défaut - rediriger vers l'interface principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'index.html'));
});

// Toutes les autres routes renvoient vers l'app React
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Interface Web - Port ${PORT}`);
  console.log(`📱 Application: http://localhost:${PORT}`);
  console.log(`🔍 Outils OSINT: http://localhost:${PORT}/osint-tools.html`);
});

module.exports = app;