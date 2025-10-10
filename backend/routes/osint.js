const express = require('express');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const jobSchema = z.object({
  toolId: z.string().min(1),
  params: z.record(z.any())
});

// GET /api/osint/tools
router.get('/tools', (req, res) => {
  try {
    const tools = [
      { id: 'amass', name: 'Amass', description: 'Subdomain enumeration' },
      { id: 'subfinder', name: 'Subfinder', description: 'Fast subdomain discovery' }
    ];
    res.json({ tools });
  } catch (error) {
    console.error('Error getting tools:', error);
    res.status(500).json({ error: 'Failed to get tools' });
  }
});

// POST /api/osint/jobs
router.post('/jobs', async (req, res) => {
  try {
    const { toolId, params } = jobSchema.parse(req.body);
    
    // TODO: Implement job creation with BullMQ
    const jobId = `${toolId}-${Date.now()}`;
    
    res.json({ 
      jobId,
      status: 'queued',
      toolId,
      params
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: error.errors });
    }
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// GET /api/osint/results
router.get('/results', (req, res) => {
  try {
    // TODO: Implement results fetching from database
    res.json({ results: [] });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

module.exports = router;