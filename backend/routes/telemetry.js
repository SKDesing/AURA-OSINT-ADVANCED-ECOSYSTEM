const express = require('express');
const router = express.Router();

const EventSchema = {
  validate: (obj) => {
    if (!obj || typeof obj.t !== 'string' || typeof obj.ts !== 'number') {
      throw new Error('Invalid event schema');
    }
    return obj;
  }
};

const BatchSchema = {
  validate: (obj) => {
    if (!obj || !Array.isArray(obj.events) || obj.events.length === 0 || obj.events.length > 5000) {
      throw new Error('Invalid batch schema');
    }
    obj.events.forEach(EventSchema.validate);
    return obj;
  }
};

// Helper: vérifier si la requête vient du local
function isLocal(req) {
  const ip = (req.ip || '').replace('::ffff:', '');
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

router.post('/batch', express.json({ limit: '1mb' }), async (req, res) => {
  try {
    if (process.env.AURA_BROWSER_ONLY === '1') {
      if (req.get('X-AURA-TELEMETRY') !== '1') {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }
      if (!isLocal(req)) {
        return res.status(403).json({ ok: false, error: 'Localhost only' });
      }
    }

    const batch = BatchSchema.validate(req.body);

    // TODO: Insert to database
    console.log(`[TELEMETRY] Received ${batch.events.length} events`);

    res.json({ ok: true, n: batch.events.length });
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message || 'Invalid payload' });
  }
});

module.exports = router;