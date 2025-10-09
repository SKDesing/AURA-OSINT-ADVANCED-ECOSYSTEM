// AURA Artifacts API - Serve HTML/CSS/JS artifacts
const express = require('express');
const { Pool } = require('pg');
const ArtifactBuilder = require('../services/artifact-builder');
const createCorsMiddleware = require('../middleware/cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(createCorsMiddleware());

// Database connection
const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'aura_osint',
  user: process.env.DB_USER || 'aura_user',
  password: process.env.DB_PASSWORD
});

const artifactBuilder = new ArtifactBuilder();

// Create artifacts table if not exists
async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS artifacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source_url TEXT,
        version TEXT NOT NULL,
        lang TEXT NOT NULL,
        hash TEXT NOT NULL,
        context_hash TEXT NOT NULL,
        html BYTEA NOT NULL,
        css BYTEA NOT NULL,
        js BYTEA NOT NULL,
        meta JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_artifacts_hash ON artifacts(hash);
      CREATE INDEX IF NOT EXISTS idx_artifacts_context ON artifacts(context_hash);
      CREATE INDEX IF NOT EXISTS idx_artifacts_created ON artifacts(created_at DESC);
    `);
    
    console.log('✅ Artifacts table initialized');
  } catch (error) {
    console.error('❌ DB init failed:', error.message);
  }
}

// Build artifact endpoint
app.post('/ops/orchestrator/run', async (req, res) => {
  const { task, source } = req.body;
  
  if (task !== 'build-artifact') {
    return res.status(400).json({ error: 'Unsupported task' });
  }
  
  if (!source || (!source.content && !source.url)) {
    return res.status(400).json({ error: 'Source content or URL required' });
  }
  
  try {
    const taskId = `artifact_${Date.now()}`;
    
    // For now, process content directly (URL fetching would be added later)
    const content = source.content || '<p>Sample content for URL processing</p>';
    const type = source.type || 'html';
    
    console.log(`🚀 Building artifact: ${taskId}`);
    
    // Process through pipeline
    const artifact = await artifactBuilder.process(content, type);
    
    // Store in database
    const result = await db.query(`
      INSERT INTO artifacts (source_url, version, lang, hash, context_hash, html, css, js, meta)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      source.url || null,
      artifact.meta.version,
      artifact.meta.lang,
      artifact.meta.source_hash,
      artifact.meta.context_hash,
      Buffer.from(artifact.html),
      Buffer.from(artifact.css),
      Buffer.from(artifact.js),
      artifact.meta
    ]);
    
    const artifactId = result.rows[0].id;
    
    console.log(`✅ Artifact built: ${artifactId} (${artifact.meta.pipeline_ms.toFixed(1)}ms)`);
    
    res.json({
      success: true,
      task_id: taskId,
      artifact_id: artifactId,
      status: 'completed',
      metrics: {
        pipeline_ms: artifact.meta.pipeline_ms,
        chunks: artifact.meta.chunks,
        entities: artifact.meta.entities
      }
    });
    
  } catch (error) {
    console.error('❌ Artifact build failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get artifact metadata
app.get('/ops/orchestrator/artifacts', async (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Artifact ID required' });
  }
  
  try {
    const result = await db.query(
      'SELECT id, source_url, version, lang, hash, context_hash, meta, created_at FROM artifacts WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artifact not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('❌ Artifact fetch failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve artifact HTML
app.get('/artifacts/:id/index.html', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT html FROM artifacts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('Artifact not found');
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(result.rows[0].html);
    
  } catch (error) {
    console.error('❌ HTML serve failed:', error);
    res.status(500).send('Internal server error');
  }
});

// Serve artifact CSS
app.get('/artifacts/:id/styles.css', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT css FROM artifacts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('Artifact not found');
    }
    
    res.setHeader('Content-Type', 'text/css');
    res.send(result.rows[0].css);
    
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Serve artifact JS
app.get('/artifacts/:id/app.js', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT js FROM artifacts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('Artifact not found');
    }
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(result.rows[0].js);
    
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Get artifact metadata JSON
app.get('/artifacts/:id/meta.json', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT meta FROM artifacts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artifact not found' });
    }
    
    res.json(result.rows[0].meta);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List artifacts
app.get('/artifacts', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  
  try {
    const result = await db.query(`
      SELECT id, source_url, version, lang, hash, meta->>'chunks' as chunks, 
             meta->>'entities' as entities, meta->>'pipeline_ms' as build_time, created_at
      FROM artifacts 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    res.json({
      artifacts: result.rows,
      total: result.rows.length
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize DB and start server
const PORT = process.env.ARTIFACTS_PORT || 4020;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🏗️ AURA Artifacts API running on port ${PORT}`);
    console.log(`📊 Endpoints:`);
    console.log(`   POST /ops/orchestrator/run`);
    console.log(`   GET  /ops/orchestrator/artifacts?id`);
    console.log(`   GET  /artifacts/:id/index.html`);
    console.log(`   GET  /artifacts/:id/meta.json`);
    console.log(`   GET  /artifacts (list)`);
  });
});

module.exports = app;