const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir les fichiers statiques du frontend buildé
app.use(express.static(path.join(__dirname, 'frontend-build')));

// Route catch-all pour React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎯 TikTok Live Analyser Frontend démarré sur http://localhost:${PORT}`);
  console.log('📱 Interface prête pour utilisation');
});

module.exports = app;