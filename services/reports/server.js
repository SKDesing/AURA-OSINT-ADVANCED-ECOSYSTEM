const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'reports',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/reports', (req, res) => {
  res.json({
    message: 'Service reports SCIS',
    status: 'active',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🔍 Service reports SCIS démarré sur le port ${PORT}`);
});
