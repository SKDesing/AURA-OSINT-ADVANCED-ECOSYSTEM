// AURA MVP Backend - Version corrigée
const express = require('express');
const cors = require('cors');
const aiHealthRouter = require('../services/ai/health-router');

const app = express();
const PORT = 4010;

// CORS permissif pour développement
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true
}));

app.use(express.json());

// AI Health endpoints
app.use('/ai', aiHealthRouter);

// Route racine pour éviter 404
app.get('/', (req, res) => {
  res.json({
    name: 'AURA MVP Backend',
    version: '1.0.0',
    endpoints: [
      'GET /ai/health',
      'GET /ai/embeddings/health',
      'GET /ai/router/health',
      'GET /ai/observability/summary',
      'GET /ai/router/decisions',
      'GET /artifacts',
      'GET /artifacts/:id',
      'GET /ai/stream/metrics'
    ]
  });
});

// Mock data
const mockMetrics = {
  tokens_saved_ratio: 0.67,
  cache_hit_ratio: 0.82,
  rag_p95: 450,
  router_bypass_rate: 0.71
};

const mockDecisions = Array.from({ length: 20 }, (_, i) => ({
  id: `decision_${i}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
  sim_semantic: Math.random() * 0.8 + 0.1,
  sim_keywords: Math.random() * 0.6 + 0.2,
  confidence: Math.random() * 0.7 + 0.3,
  decision: ['rag_llm', 'bypass', 'cache'][Math.floor(Math.random() * 3)],
  features_hash: `hash_${Math.random().toString(36).substr(2, 16)}`,
  query_preview: `Query example ${i + 1} about OSINT analysis...`
}));

const mockArtifacts = Array.from({ length: 10 }, (_, i) => ({
  id: `artifact_${i}`,
  title: `Document ${i + 1}`,
  build_ms: Math.floor(Math.random() * 200) + 50,
  chunks_count: Math.floor(Math.random() * 20) + 5,
  entities_count: Math.floor(Math.random() * 15) + 3,
  content_hash: `content_${Math.random().toString(36).substr(2, 16)}`,
  context_hash: `context_${Math.random().toString(36).substr(2, 16)}`,
  created_at: new Date(Date.now() - i * 3600000).toISOString()
}));

// Endpoints MVP
app.get('/ai/observability/summary', (req, res) => {
  console.log('📊 Observability metrics requested');
  const metrics = {
    tokens_saved_ratio: Math.max(0, Math.min(1, mockMetrics.tokens_saved_ratio + (Math.random() - 0.5) * 0.1)),
    cache_hit_ratio: Math.max(0, Math.min(1, mockMetrics.cache_hit_ratio + (Math.random() - 0.5) * 0.05)),
    rag_p95: Math.max(100, mockMetrics.rag_p95 + Math.floor((Math.random() - 0.5) * 100)),
    router_bypass_rate: Math.max(0, Math.min(1, mockMetrics.router_bypass_rate + (Math.random() - 0.5) * 0.05))
  };
  res.json(metrics);
});

app.get('/ai/router/decisions', (req, res) => {
  console.log('🧠 Router decisions requested');
  const limit = parseInt(req.query.limit) || 50;
  res.json(mockDecisions.slice(0, limit));
});

app.get('/artifacts', (req, res) => {
  console.log('📄 Artifacts list requested');
  const limit = parseInt(req.query.limit) || 20;
  res.json(mockArtifacts.slice(0, limit));
});

app.get('/artifacts/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📄 Artifact ${id} content requested`);
  
  const artifact = mockArtifacts.find(a => a.id === id);
  if (!artifact) {
    return res.status(404).json({ error: 'Artifact not found' });
  }
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${artifact.title}</title>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      padding: 20px; 
      background: #f8fafc; 
      color: #1e293b;
      line-height: 1.6;
    }
    .header { 
      color: #2563eb; 
      border-bottom: 2px solid #e2e8f0; 
      padding-bottom: 15px; 
      margin-bottom: 20px;
    }
    .stats { 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 20px 0; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .entity { 
      background: #fef3c7; 
      color: #92400e;
      padding: 2px 8px; 
      border-radius: 4px; 
      font-weight: 500;
    }
    .content { margin-top: 20px; }
    code { 
      background: #f1f5f9; 
      padding: 2px 6px; 
      border-radius: 3px; 
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.9em;
    }
    h1 { margin: 0; font-size: 1.8em; }
    h2 { color: #374151; margin-top: 30px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${artifact.title}</h1>
    <p>Generated artifact with ${artifact.chunks_count} chunks and ${artifact.entities_count} entities</p>
  </div>
  
  <div class="stats">
    <strong>Build time:</strong> ${artifact.build_ms}ms<br>
    <strong>Content hash:</strong> <code>${artifact.content_hash}</code><br>
    <strong>Context hash:</strong> <code>${artifact.context_hash}</code><br>
    <strong>Created:</strong> ${new Date(artifact.created_at).toLocaleString()}
  </div>
  
  <div class="content">
    <h2>🔍 OSINT Analysis Sample</h2>
    <p>This is a mock artifact content for <span class="entity">OSINT analysis</span> generated by the AURA platform.</p>
    
    <p>The document demonstrates the pipeline's capability to process and analyze intelligence data, 
    extracting <span class="entity">key entities</span> and generating <span class="entity">structured artifacts</span>.</p>
    
    <h2>📊 Key Findings</h2>
    <ul>
      <li><strong>Entity extraction:</strong> ${artifact.entities_count} entities identified and classified</li>
      <li><strong>Content segmentation:</strong> ${artifact.chunks_count} semantic chunks processed</li>
      <li><strong>Processing efficiency:</strong> ${artifact.build_ms}ms total build time</li>
      <li><strong>Data integrity:</strong> Content and context hashes generated for verification</li>
    </ul>
    
    <h2>🛡️ Security & Compliance</h2>
    <p>This artifact follows AURA's security guidelines with <span class="entity">PII masking</span> 
    and <span class="entity">data sanitization</span> applied throughout the processing pipeline.</p>
  </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(htmlContent);
});

app.get('/artifacts/:id/meta.json', (req, res) => {
  const { id } = req.params;
  console.log(`📄 Artifact ${id} metadata requested`);
  
  const artifact = mockArtifacts.find(a => a.id === id);
  if (!artifact) {
    return res.status(404).json({ error: 'Artifact not found' });
  }
  
  res.json(artifact);
});

// SSE endpoint avec headers corrects
app.get('/ai/stream/metrics', (req, res) => {
  console.log('📡 SSE metrics stream started');
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  const sendMetrics = () => {
    const metrics = {
      tokens_saved_ratio: Math.max(0, Math.min(1, mockMetrics.tokens_saved_ratio + (Math.random() - 0.5) * 0.1)),
      cache_hit_ratio: Math.max(0, Math.min(1, mockMetrics.cache_hit_ratio + (Math.random() - 0.5) * 0.05)),
      rag_p95: Math.max(100, mockMetrics.rag_p95 + Math.floor((Math.random() - 0.5) * 100)),
      router_bypass_rate: Math.max(0, Math.min(1, mockMetrics.router_bypass_rate + (Math.random() - 0.5) * 0.05))
    };
    
    res.write(`data: ${JSON.stringify({ type: 'metrics', payload: metrics })}\n\n`);
  };
  
  // Envoi initial
  sendMetrics();
  
  // Mise à jour toutes les 3 secondes
  const interval = setInterval(sendMetrics, 3000);
  
  req.on('close', () => {
    console.log('📡 SSE stream closed');
    clearInterval(interval);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 AURA MVP Backend running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`  GET  /                           - API info`);
  console.log(`  GET  /ai/health                  - AI aggregate health`);
  console.log(`  GET  /ai/embeddings/health       - Embeddings health`);
  console.log(`  GET  /ai/router/health           - Router health`);
  console.log(`  GET  /ai/observability/summary   - Metrics`);
  console.log(`  GET  /ai/router/decisions        - Router decisions`);
  console.log(`  GET  /artifacts                  - Artifacts list`);
  console.log(`  GET  /artifacts/:id              - Artifact content`);
  console.log(`  GET  /artifacts/:id/meta.json    - Artifact metadata`);
  console.log(`  GET  /ai/stream/metrics          - SSE metrics stream`);
  console.log(`  GET  /health                     - Health check`);
});

// Graceful shutdown
require('./utils/graceful-shutdown')(server);