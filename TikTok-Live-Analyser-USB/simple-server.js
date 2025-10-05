const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend-build')));

app.get('/osint-tools.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'osint-tools.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'osint-tools.html'));
});

app.listen(PORT, () => {
  console.log(`🔍 Interface OSINT - Port ${PORT}`);
  console.log(`🔍 Outils OSINT: http://localhost:${PORT}`);
  console.log(`📱 Application principale: http://localhost:3000`);
});

module.exports = app;