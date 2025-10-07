const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'lives',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/lives', (req, res) => {
  res.json({
    message: 'Service lives SCIS',
    status: 'active',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🔍 Service lives SCIS démarré sur le port ${PORT}`);
});
