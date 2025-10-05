const express = require('express');
const cors = require('cors');
const MagnetForensicsGateway = require('./magnet-connector');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configuration Magnet Forensics
const forensicConfig = {
  axiom: {
    axiomPath: process.env.AXIOM_INSTALL_PATH || '/opt/magnet/axiom',
    workspacePath: process.env.AXIOM_WORKSPACE || '/workspace/axiom'
  },
  outrider: {
    clientId: process.env.OUTRIDER_CLIENT_ID,
    clientSecret: process.env.OUTRIDER_CLIENT_SECRET
  },
  automate: {
    endpoint: process.env.AUTOMATE_ENDPOINT,
    apiKey: process.env.AUTOMATE_API_KEY
  }
};

// Initialisation du Gateway Magnet
const forensicGateway = new MagnetForensicsGateway(forensicConfig);

// Endpoint principal - Traitement forensique complet
app.post('/api/forensic/process', async (req, res) => {
  try {
    const { target, investigator, options } = req.body;
    
    if (!target || !target.platform || !target.username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Target platform and username required' 
      });
    }

    const forensicRequest = {
      id: `REQ_${Date.now()}`,
      target,
      investigator: investigator || 'SCIS System',
      options: options || {},
      timestamp: new Date().toISOString()
    };

    const result = await forensicGateway.processForensicRequest(forensicRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Status d'une investigation forensique
app.get('/api/forensic/status/:forensicId', async (req, res) => {
  try {
    const result = await forensicGateway.getForensicStatus(req.params.forensicId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AXIOM - Création de cas
app.post('/api/axiom/case', async (req, res) => {
  try {
    const result = await forensicGateway.axiom.createCase(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AXIOM - Traitement de cas
app.post('/api/axiom/process/:caseId', async (req, res) => {
  try {
    const result = await forensicGateway.axiom.processCase(req.params.caseId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// OUTRIDER - Collecte de données
app.post('/api/outrider/collect', async (req, res) => {
  try {
    const result = await forensicGateway.outrider.createCollection(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// OUTRIDER - Status de collecte
app.get('/api/outrider/status/:collectionId', async (req, res) => {
  try {
    const result = await forensicGateway.outrider.getCollectionStatus(req.params.collectionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AUTOMATE - Création de workflow
app.post('/api/automate/workflow', async (req, res) => {
  try {
    const result = await forensicGateway.automate.createWorkflow(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AUTOMATE - Exécution de workflow
app.post('/api/automate/execute/:workflowId', async (req, res) => {
  try {
    const result = await forensicGateway.automate.executeWorkflow(
      req.params.workflowId, 
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validation d'intégrité des preuves
app.post('/api/validate/evidence', async (req, res) => {
  try {
    const result = await forensicGateway.validateEvidence(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check avancé
app.get('/health', async (req, res) => {
  try {
    // Test connectivité OUTRIDER
    const outriderAuth = await forensicGateway.outrider.authenticate();
    
    res.json({
      service: 'forensic-integration',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      components: {
        axiom: {
          status: forensicGateway.axiom.axiomPath ? 'configured' : 'not_configured',
          path: forensicGateway.axiom.axiomPath
        },
        outrider: {
          status: outriderAuth.success ? 'connected' : 'disconnected',
          authenticated: outriderAuth.success
        },
        automate: {
          status: forensicGateway.automate.apiKey ? 'configured' : 'not_configured',
          endpoint: forensicGateway.automate.endpoint
        }
      },
      version: '2.0.0',
      architecture: 'enterprise-gateway'
    });
  } catch (error) {
    res.status(500).json({
      service: 'forensic-integration',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Documentation API
app.get('/api/docs', (req, res) => {
  res.json({
    service: 'SCIS Forensic Integration Gateway',
    version: '2.0.0',
    endpoints: {
      'POST /api/forensic/process': 'Traitement forensique complet',
      'GET /api/forensic/status/:id': 'Status investigation',
      'POST /api/axiom/case': 'Création cas AXIOM',
      'POST /api/axiom/process/:id': 'Traitement cas AXIOM',
      'POST /api/outrider/collect': 'Collecte OUTRIDER',
      'GET /api/outrider/status/:id': 'Status collecte',
      'POST /api/automate/workflow': 'Création workflow',
      'POST /api/automate/execute/:id': 'Exécution workflow',
      'POST /api/validate/evidence': 'Validation intégrité',
      'GET /health': 'Health check',
      'GET /api/docs': 'Documentation API'
    },
    magnet_tools: {
      'AXIOM Cyber': 'Desktop integration for social media analysis',
      'OUTRIDER': 'Cloud API for online data collection',
      'AUTOMATE': 'GraphQL workflow automation',
      'Validation': 'Cryptographic evidence integrity'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🎭 Forensic Gateway Maestro running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔬 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;