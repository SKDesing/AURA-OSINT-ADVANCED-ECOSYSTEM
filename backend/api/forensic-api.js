const express = require('express');
const { param, query } = require('express-validator');
const ForensicProfileManager = require('../managers/forensic-profile-manager');

const router = express.Router();
const manager = new ForensicProfileManager();

router.get('/profiles', async (req, res) => {
  try {
    const profiles = await manager.listProfiles();
    res.json({
      total: profiles.length,
      profiles: profiles.map(p => ({
        sessionId: p.sessionId,
        targetId: p.targetId,
        operator: p.operator,
        createdAt: p.createdAt,
        profileName: p.profileName
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/report/:sessionId', [
  param('sessionId').isUUID()
], async (req, res) => {
  try {
    const report = await manager.exportForensicReport(req.params.sessionId);
    
    if (req.query.download === 'true') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="forensic-report-${req.params.sessionId}.json"`);
    }
    
    res.json(report);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/archive/:sessionId', async (req, res) => {
  try {
    const profiles = await manager.listProfiles();
    const profile = profiles.find(p => p.sessionId === req.params.sessionId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const result = await manager.archiveProfile(profile.path);
    res.json({
      success: true,
      archivePath: result.archivePath,
      signature: result.signature
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/cleanup', [
  query('retentionDays').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const retentionDays = parseInt(req.query.retentionDays) || 90;
    const deleted = await manager.cleanupExpiredProfiles(retentionDays);
    
    res.json({
      success: true,
      deleted_profiles: deleted,
      retention_policy: `${retentionDays} days`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;