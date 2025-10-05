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
    service: 'create',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/create', (req, res) => {
  res.json({
    message: 'Service create SCIS',
    status: 'active',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🔍 Service create SCIS démarré sur le port ${PORT}`);
});
