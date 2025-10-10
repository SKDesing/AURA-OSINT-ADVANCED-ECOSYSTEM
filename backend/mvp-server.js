// AURA MVP Backend - Serveur simple
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4011;

// CORS pour le frontend React
app.use(cors({
  origin: ['http://localhost:54112', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

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

// Routes MVP
app.get('/ai/observability/summary', (req, res) => {
  const metrics = {
    ...mockMetrics,
    tokens_saved_ratio: Math.max(0, Math.min(1, mockMetrics.tokens_saved_ratio + (Math.random() - 0.5) * 0.1)),
    cache_hit_ratio: Math.max(0, Math.min(1, mockMetrics.cache_hit_ratio + (Math.random() - 0.5) * 0.05)),
    rag_p95: Math.max(100, mockMetrics.rag_p95 + Math.floor((Math.random() - 0.5) * 100)),
    router_bypass_rate: Math.max(0, Math.min(1, mockMetrics.router_bypass_rate + (Math.random() - 0.5) * 0.05))
  };
  res.json(metrics);
});

app.get('/ai/router/decisions', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(mockDecisions.slice(0, limit));
});

app.get('/artifacts', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json(mockArtifacts.slice(0, limit));
});

app.get('/artifacts/:id', (req, res) => {
  const { id } = req.params;
  const artifact = mockArtifacts.find(a => a.id === id);
  
  if (!artifact) {
    return res.status(404).json({ error: 'Artifact not found' });
  }
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${artifact.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; }
    .header { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .content { margin-top: 20px; line-height: 1.6; }
    .entity { background: #fef3c7; padding: 2px 6px; border-radius: 4px; }
    .stats { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
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
    <strong>Context hash:</strong> <code>${artifact.context_hash}</code>
  </div>
  <div class="content">
    <h2>OSINT Analysis Sample</h2>
    <p>This is a mock artifact content for <span class="entity">OSINT analysis</span>.</p>
    <p>The document contains <span class="entity">sample entities</span> and <span class="entity">mock data</span> 
    for demonstration purposes of the AURA platform.</p>
    <h3>Key Findings</h3>
    <ul>
      <li>Entity extraction: ${artifact.entities_count} entities identified</li>
      <li>Content segmentation: ${artifact.chunks_count} chunks processed</li>
      <li>Processing efficiency: ${artifact.build_ms}ms build time</li>
    </ul>
  </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
});

app.get('/artifacts/:id/meta.json', (req, res) => {
  const { id } = req.params;
  const artifact = mockArtifacts.find(a => a.id === id);
  
  if (!artifact) {
    return res.status(404).json({ error: 'Artifact not found' });
  }
  
  res.json(artifact);
});

// SSE endpoint
app.get('/ai/stream/metrics', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  const sendMetrics = () => {
    const metrics = {
      ...mockMetrics,
      tokens_saved_ratio: Math.max(0, Math.min(1, mockMetrics.tokens_saved_ratio + (Math.random() - 0.5) * 0.1)),
      cache_hit_ratio: Math.max(0, Math.min(1, mockMetrics.cache_hit_ratio + (Math.random() - 0.5) * 0.05)),
      rag_p95: Math.max(100, mockMetrics.rag_p95 + Math.floor((Math.random() - 0.5) * 100)),
      router_bypass_rate: Math.max(0, Math.min(1, mockMetrics.router_bypass_rate + (Math.random() - 0.5) * 0.05))
    };
    
    res.write(`data: ${JSON.stringify({ type: 'metrics', payload: metrics })}\n\n`);
  };
  
  sendMetrics();
  const interval = setInterval(sendMetrics, 5000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AURA MVP Backend running on http://localhost:${PORT}`);
  console.log(`📊 Endpoints available:`);
  console.log(`  GET /ai/observability/summary`);
  console.log(`  GET /ai/router/decisions`);
  console.log(`  GET /artifacts`);
  console.log(`  GET /artifacts/:id`);
  console.log(`  GET /ai/stream/metrics (SSE)`);
});