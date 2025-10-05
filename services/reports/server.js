const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const FORENSIC_SERVICE_URL = process.env.FORENSIC_SERVICE_URL || 'http://localhost:3008';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Génération de rapport forensique avec Magnet
app.post('/api/forensic-report', async (req, res) => {
  try {
    const { profileId, evidenceData } = req.body;
    
    // Analyse AI avec Magnet
    const aiAnalysis = await axios.post(`${FORENSIC_SERVICE_URL}/api/ai/analyze`, {
      type: 'social-media',
      content: evidenceData
    });
    
    // Validation d'intégrité
    const validation = await axios.post(`${FORENSIC_SERVICE_URL}/api/validate/evidence`, {
      hash: evidenceData.hash
    });
    
    const report = {
      profileId,
      analysis: aiAnalysis.data,
      validation: validation.data,
      timestamp: new Date().toISOString(),
      forensicStandard: 'Magnet-Compatible'
    };
    
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'reports',
    forensicIntegration: 'magnet-enabled',
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
