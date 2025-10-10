const express = require('express');
const { z } = require('zod');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const router = express.Router();

const REDIS_URL = process.env.ORCHESTRATOR_REDIS_URL || 'redis://localhost:6379/5';
const connection = new IORedis(REDIS_URL);
const queue = new Queue('osint', { connection });

const CreateJobSchema = z.object({
  toolId: z.string().min(1),
  params: z.record(z.any()).default({}),
});

// POST /api/osint/jobs
router.post('/jobs', async (req, res) => {
  try {
    const { toolId, params } = CreateJobSchema.parse(req.body);
    const job = await queue.add('run', { toolId, params }, {
      removeOnComplete: 100,
      removeOnFail: 100,
    });
    res.json({ jobId: job.id, status: 'queued', toolId, params });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: 'Invalid request', details: e.errors });
    console.error('Create job error:', e);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// GET /api/osint/jobs
router.get('/jobs', async (_req, res) => {
  try {
    const jobs = await queue.getJobs(['waiting', 'delayed', 'active', 'completed', 'failed'], 0, 100, true);
    const data = jobs.map((j) => ({
      id: j.id,
      jobId: j.id,
      toolId: j.data?.toolId,
      params: j.data?.params || {},
      status: j.finishedOn ? 'completed' : j.failedReason ? 'failed' : j.processedOn ? 'active' : 'queued',
      createdAt: j.timestamp ? new Date(j.timestamp).toISOString() : undefined,
      updatedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : job.processedOn ? new Date(job.processedOn).toISOString() : undefined,
      durationMs: j.finishedOn && j.processedOn ? j.finishedOn - j.processedOn : undefined,
    }));
    res.json({ jobs: data });
  } catch (e) {
    console.error('List jobs error:', e);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

// GET /api/osint/jobs/:id
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await queue.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const status = job.finishedOn ? 'completed' : job.failedReason ? 'failed' : job.processedOn ? 'active' : 'queued';
    res.json({
      id: job.id,
      jobId: job.id,
      toolId: job.data?.toolId,
      params: job.data?.params || {},
      status,
      createdAt: job.timestamp ? new Date(job.timestamp).toISOString() : undefined,
      updatedAt: job.finishedOn ? new Date(j.finishedOn).toISOString() : job.processedOn ? new Date(job.processedOn).toISOString() : undefined,
      durationMs: job.finishedOn && job.processedOn ? job.finishedOn - job.processedOn : undefined,
      failedReason: job.failedReason,
      returnvalue: job.returnvalue,
    });
  } catch (e) {
    console.error('Get job error:', e);
    res.status(500).json({ error: 'Failed to get job' });
  }
});

// POST /api/osint/jobs/:id/cancel
router.post('/jobs/:id/cancel', async (req, res) => {
  try {
    const job = await queue.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const state = await job.getState();
    if (state === 'waiting' || state === 'delayed') {
      await job.remove();
      return res.json({ ok: true, status: 'removed' });
    }
    return res.status(409).json({ ok: false, error: 'Cannot cancel an active/completed job' });
  } catch (e) {
    console.error('Cancel job error:', e);
    res.status(500).json({ error: 'Failed to cancel job' });
  }
});

// POST /api/osint/jobs/:id/retry
router.post('/jobs/:id/retry', async (req, res) => {
  try {
    const job = await queue.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    await job.retry();
    res.json({ ok: true });
  } catch (e) {
    console.error('Retry job error:', e);
    res.status(500).json({ error: 'Failed to retry job' });
  }
});

module.exports = router;