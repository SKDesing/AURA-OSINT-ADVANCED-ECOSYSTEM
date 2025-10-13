const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());

const API_URL = 'http://localhost:4011';

app.get('/', async (req, res) => {
  try {
    const health = await axios.get(`${API_URL}/health`);
    res.render('dashboard', { status: health.data });
  } catch (error) {
    res.render('dashboard', { status: { error: 'Backend offline' } });
  }
});

app.get('/investigate', (req, res) => {
  res.render('investigate');
});

app.post('/api/investigate', async (req, res) => {
  try {
    const result = await axios.post(`${API_URL}/api/osint/investigate`, req.body);
    res.json(result.data);
  } catch (error) {
    res.json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 AURA OSINT Frontend → http://localhost:${PORT}`);
});
