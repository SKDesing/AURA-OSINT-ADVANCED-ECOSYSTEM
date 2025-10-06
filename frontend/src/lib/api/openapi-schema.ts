import { z } from 'zod';

// Base schemas
export const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
    traceId: z.string().optional(),
  }),
});

export const PaginationSchema = z.object({
  nextCursor: z.string().optional(),
  prevCursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().optional(),
});

// Job schemas
export const JobStatusSchema = z.enum(['queued', 'running', 'partial', 'done', 'error']);

export const JobSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['tiktok_analyze', 'dorks_run', 'export']),
  status: JobStatusSchema,
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

// TikTok schemas
export const TikTokAnalyzeRequestSchema = z.object({
  url: z.string().url().optional(),
  handle: z.string().min(1).optional(),
  options: z.object({
    deep_search: z.boolean().default(false),
    duration_minutes: z.number().min(1).max(120).default(30),
  }).optional(),
}).refine(data => data.url || data.handle, {
  message: "Either url or handle must be provided"
});

export const TikTokSessionSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  platform: z.literal('tiktok'),
  sourceRef: z.string(),
  metadata: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    viewers: z.number().optional(),
    duration: z.number().optional(),
  }),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
});

// SSE Event schemas
export const SSEEventSchema = z.object({
  id: z.string(),
  event: z.enum(['job.update', 'job.done', 'job.error']),
  data: z.object({
    jobId: z.string().uuid(),
    status: JobStatusSchema,
    progress: z.number().min(0).max(100).optional(),
    eta: z.string().datetime().optional(),
    payload: z.record(z.any()).optional(),
  }),
});

// Type exports
export type Job = z.infer<typeof JobSchema>;
export type TikTokAnalyzeRequest = z.infer<typeof TikTokAnalyzeRequestSchema>;
export type TikTokSession = z.infer<typeof TikTokSessionSchema>;
export type SSEEvent = z.infer<typeof SSEEventSchema>;
export type ApiError = z.infer<typeof ErrorSchema>;