const express = require('express');
const OSINTIntelligenceEngine = require('../../osint-intelligence-engine');

const router = express.Router();

const osintEngine = new OSINTIntelligenceEngine({
  database: {
    connectionString: process.env.DATABASE_URL
  },
  toolsPath: process.env.OSINT_TOOLS_PATH || '/app/osint-tools'
});

// Username search across platforms
router.post('/search/username', async (req, res) => {
  try {
    const { username, platforms = ['all'] } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const results = await osintEngine.searchUsername(username, platforms);
    
    res.json({
      success: true,
      target: username,
      platforms,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Email harvesting
router.post('/harvest/emails', async (req, res) => {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain required' });
    }

    const results = await osintEngine.harvestEmails(domain);
    
    res.json({
      success: true,
      domain,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Metadata analysis
router.post('/analyze/metadata', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' });
    }

    const results = await osintEngine.analyzeMetadata(filePath);
    
    res.json({
      success: true,
      file: filePath,
      metadata: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Identity correlation
router.post('/correlate/identities', async (req, res) => {
  try {
    const { identities } = req.body;
    
    if (!identities || !Array.isArray(identities)) {
      return res.status(400).json({ error: 'Identities array required' });
    }

    const correlations = await osintEngine.correlateIdentities(identities);
    
    res.json({
      success: true,
      input_count: identities.length,
      correlations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// OSINT system stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await osintEngine.getSystemStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Comprehensive OSINT investigation
router.post('/investigate', async (req, res) => {
  try {
    const { target, type = 'username' } = req.body;
    
    if (!target) {
      return res.status(400).json({ error: 'Target required' });
    }

    const investigation = {
      target,
      type,
      started_at: new Date().toISOString(),
      results: {}
    };

    // Username search
    if (type === 'username' || type === 'comprehensive') {
      investigation.results.username_search = await osintEngine.searchUsername(target);
    }

    // Email harvesting if target looks like domain
    if (type === 'domain' || (type === 'comprehensive' && target.includes('.'))) {
      investigation.results.email_harvest = await osintEngine.harvestEmails(target);
    }

    investigation.completed_at = new Date().toISOString();
    investigation.duration_ms = new Date(investigation.completed_at) - new Date(investigation.started_at);

    res.json({
      success: true,
      investigation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;