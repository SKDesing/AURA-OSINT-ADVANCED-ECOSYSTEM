#!/bin/bash
set -e

echo "🔧 CRÉATION DES ROUTES MANQUANTES..."

cd backend

# 1. Route OSINT
cat > routes/osint.js << 'EOF'
const express = require('express');
const router = express.Router();

router.post('/investigate', async (req, res) => {
  const { target, type } = req.body;
  res.json({ status: 'success', target, type, message: 'Investigation lancée' });
});

router.post('/username', async (req, res) => {
  const { username } = req.body;
  res.json({ status: 'success', tool: 'sherlock', username });
});

router.post('/domain', async (req, res) => {
  const { domain } = req.body;
  res.json({ status: 'success', tools: ['theHarvester', 'whois'], domain });
});

module.exports = router;
EOF

# 2. Route Forensic
cat > routes/forensic.js << 'EOF'
const express = require('express');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  res.json({ status: 'success', message: 'Forensic analysis endpoint' });
});

module.exports = router;
EOF

# 3. Route RAG
cat > routes/rag.js << 'EOF'
const express = require('express');
const router = express.Router();

router.post('/query', async (req, res) => {
  const { question } = req.body;
  res.json({ status: 'success', question, answer: 'RAG system ready', sources: [] });
});

router.post('/ingest', async (req, res) => {
  const { documents } = req.body;
  res.json({ status: 'success', ingested: documents?.length || 0 });
});

module.exports = router;
EOF

# 4. Route Metrics
cat > routes/metrics.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  res.json({
    status: 'success',
    uptime: Math.floor(uptime),
    memory: {
      rss: Math.floor(memUsage.rss / 1024 / 1024) + ' MB',
      heapUsed: Math.floor(memUsage.heapUsed / 1024 / 1024) + ' MB'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
EOF

echo "✅ Routes créées"
echo ""
echo "🚀 Démarre le backend:"
echo "  cd backend && node server.js"
