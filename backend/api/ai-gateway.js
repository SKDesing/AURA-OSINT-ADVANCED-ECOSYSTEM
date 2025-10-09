// AI Gateway - Endpoints pour Front AURA
const express = require('express');
const app = express();

app.use(express.json());

// Observability metrics endpoint
app.get('/ai/observability/summary', (req, res) => {
  res.json({
    tokens_saved_ratio: 0.73,
    cache_hit_ratio: 0.89,
    rag_p95: 245,
    router_bypass_rate: 0.12,
    guardrail_block_rate: 0.05,
    timestamp: new Date().toISOString()
  });
});

// Router decisions endpoint
app.get('/ai/router/decisions', (req, res) => {
  const { limit = 50, since } = req.query;
  
  const decisions = Array.from({ length: parseInt(limit) }, (_, i) => ({
    id: `decision_${Date.now()}_${i}`,
    decision: ['local', 'remote', 'bypass'][Math.floor(Math.random() * 3)],
    confidence: Math.random(),
    features_hash: `hash_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(Date.now() - i * 60000).toISOString()
  }));
  
  res.json(decisions);
});

// Orchestrator run endpoint
app.post('/ops/orchestrator/run', async (req, res) => {
  const { task, args = {} } = req.body;
  
  console.log(`🚀 Running task: ${task}`, args);
  
  // Simulate task execution
  const taskId = `task_${Date.now()}`;
  
  res.json({
    success: true,
    task_id: taskId,
    status: 'running',
    message: `Task ${task} started successfully`
  });
});

// SSE metrics stream
app.get('/ai/stream/metrics', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const sendMetric = () => {
    const data = {
      type: 'metrics',
      payload: {
        tokens_saved_ratio: Math.random() * 0.2 + 0.7,
        cache_hit_ratio: Math.random() * 0.1 + 0.85,
        rag_p95: Math.random() * 100 + 200,
        router_bypass_rate: Math.random() * 0.1 + 0.1
      },
      timestamp: new Date().toISOString()
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial data
  sendMetric();
  
  // Send updates every 2 seconds
  const interval = setInterval(sendMetric, 2000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.AI_GATEWAY_PORT || 4010;
app.listen(PORT, () => {
  console.log(`🧠 AI Gateway running on port ${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   GET  /ai/observability/summary`);
  console.log(`   GET  /ai/router/decisions`);
  console.log(`   POST /ops/orchestrator/run`);
  console.log(`   GET  /ai/stream/metrics (SSE)`);
});

module.exports = app;