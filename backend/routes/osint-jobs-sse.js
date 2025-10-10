const express = require('express');
const { QueueEvents } = require('bullmq');
const IORedis = require('ioredis');

const router = express.Router();
const REDIS_URL = process.env.ORCHESTRATOR_REDIS_URL || 'redis://localhost:6379/5';
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });
const queueEvents = new QueueEvents('osint', { connection });

// GET /api/osint/jobs/:id/stream (SSE)
router.get('/jobs/:id/stream', async (req, res) => {
  const jobId = req.params.id;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  let closed = false;
  req.on('close', () => { closed = true; });

  send('open', { ok: true, jobId });

  const hCompleted = ({ jobId: jid, returnvalue }) => { if (!closed && String(jid) === String(jobId)) send('completed', { jobId, returnvalue }); };
  const hFailed = ({ jobId: jid, failedReason }) => { if (!closed && String(jid) === String(jobId)) send('failed', { jobId, failedReason }); };
  const hActive = ({ jobId: jid }) => { if (!closed && String(jid) === String(jobId)) send('active', { jobId }); };

  queueEvents.on('completed', hCompleted);
  queueEvents.on('failed', hFailed);
  queueEvents.on('active', hActive);

  // Heartbeat
  const hb = setInterval(() => { if (!closed) send('hb', { t: Date.now() }); }, 10000);

  req.on('close', () => {
    clearInterval(hb);
    queueEvents.off('completed', hCompleted);
    queueEvents.off('failed', hFailed);
    queueEvents.off('active', hActive);
    res.end();
  });
});

module.exports = router;