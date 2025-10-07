const express = require('express');
const { body, param, validationResult } = require('express-validator');
const AuraChromiumLauncher = require('../launchers/chromium-launcher-v3');

const router = express.Router();
const activeSessions = new Map();

router.post('/start', [
  body('targetId').isString().notEmpty(),
  body('options').optional().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { targetId, options } = req.body;
    
    const launcher = new AuraChromiumLauncher(targetId, options);
    await launcher.launch();

    activeSessions.set(launcher.sessionId, {
      launcher,
      metadata: {
        targetId,
        startedAt: new Date().toISOString(),
        operator: req.user?.username || 'API'
      }
    });

    res.json({
      success: true,
      sessionId: launcher.sessionId,
      profilePath: launcher.profilePath
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/stop/:sessionId', [
  param('sessionId').isUUID()
], async (req, res) => {
  const { sessionId } = req.params;

  if (!activeSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    const { launcher } = activeSessions.get(sessionId);
    await launcher.cleanup();
    activeSessions.delete(sessionId);

    res.json({ success: true, message: 'Session terminated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!activeSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { launcher, metadata } = activeSessions.get(sessionId);
  const pages = await launcher.browser.pages();

  res.json({
    sessionId,
    ...metadata,
    activePages: pages.length,
    currentUrl: pages[0] ? pages[0].url() : null,
    profilePath: launcher.profilePath
  });
});

router.post('/interact/:sessionId', [
  body('action').isIn(['goto', 'screenshot', 'evaluate']),
  body('params').isObject()
], async (req, res) => {
  const { sessionId } = req.params;
  const { action, params } = req.body;

  if (!activeSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    const { launcher } = activeSessions.get(sessionId);
    const page = (await launcher.browser.pages())[0];

    let result;
    switch (action) {
      case 'goto':
        await page.goto(params.url, { waitUntil: 'networkidle2' });
        result = { success: true };
        break;
      case 'screenshot':
        result = await page.screenshot({ fullPage: params.fullPage });
        break;
      case 'evaluate':
        result = await page.evaluate(params.script);
        break;
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;