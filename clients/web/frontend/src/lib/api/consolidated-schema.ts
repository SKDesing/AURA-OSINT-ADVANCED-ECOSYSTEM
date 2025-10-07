import { z } from 'zod';

// =============================================================================
// CONSOLIDATED OPENAPI SCHEMA - AURA OSINT
// Source of truth for all API contracts
// =============================================================================

// Base Types
export const UUIDSchema = z.string().uuid();
export const TimestampSchema = z.string().datetime();
export const CursorSchema = z.string().min(1);

// Error Handling
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
    traceId: z.string().optional(),
  }),
});

// Pagination
export const PaginationRequestSchema = z.object({
  cursor: CursorSchema.optional(),
  limit: z.number().min(1).max(100).default(20),
});

export const PaginationResponseSchema = z.object({
  nextCursor: CursorSchema.optional(),
  prevCursor: CursorSchema.optional(),
  hasMore: z.boolean(),
  total: z.number().optional(),
});

// Jobs System
export const JobStatusSchema = z.enum(['queued', 'running', 'partial', 'done', 'error']);
export const JobTypeSchema = z.enum(['tiktok_analyze', 'dorks_run', 'export', 'enrichment']);

export const JobSchema = z.object({
  id: UUIDSchema,
  type: JobTypeSchema,
  status: JobStatusSchema,
  progress: z.number().min(0).max(100).default(0),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  userId: UUIDSchema,
  metadata: z.record(z.any()).optional(),
  error: z.string().optional(),
});

// TikTok Analysis
export const TikTokAnalyzeRequestSchema = z.object({
  url: z.string().url().optional(),
  handle: z.string().regex(/^@?[a-zA-Z0-9._-]+$/).optional(),
  options: z.object({
    deep_search: z.boolean().default(false),
    duration_minutes: z.number().min(1).max(120).default(30),
    capture_chat: z.boolean().default(true),
    capture_metrics: z.boolean().default(true),
  }).optional(),
}).refine(data => data.url || data.handle, {
  message: "Either url or handle must be provided"
});

export const TikTokSessionSchema = z.object({
  id: UUIDSchema,
  jobId: UUIDSchema,
  platform: z.literal('tiktok'),
  sourceRef: z.string(),
  metadata: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    authorId: z.string().optional(),
    viewers: z.number().optional(),
    duration: z.number().optional(),
    isLive: z.boolean().optional(),
  }),
  startedAt: TimestampSchema,
  endedAt: TimestampSchema.optional(),
});

export const TikTokMetricSchema = z.object({
  id: UUIDSchema,
  sessionId: UUIDSchema,
  name: z.enum(['viewers', 'likes', 'shares', 'comments', 'gifts']),
  value: z.number(),
  timestamp: TimestampSchema,
});

export const TikTokMessageSchema = z.object({
  id: UUIDSchema,
  sessionId: UUIDSchema,
  author: z.string(),
  authorId: z.string().optional(),
  content: z.string(),
  timestamp: TimestampSchema,
  metadata: z.record(z.any()).optional(),
});

// Dorks System
export const DorksRunRequestSchema = z.object({
  packId: UUIDSchema.optional(),
  query: z.string().min(1).optional(),
  variables: z.record(z.string()).optional(),
  filters: z.object({
    domain: z.string().optional(),
    dateRange: z.object({
      start: TimestampSchema.optional(),
      end: TimestampSchema.optional(),
    }).optional(),
    language: z.string().optional(),
  }).optional(),
  options: z.object({
    throttle_ms: z.number().min(100).max(5000).default(1000),
    max_results: z.number().min(1).max(1000).default(100),
    deep_search: z.boolean().default(false),
  }).optional(),
}).refine(data => data.packId || data.query, {
  message: "Either packId or query must be provided"
});

export const DorksResultSchema = z.object({
  id: UUIDSchema,
  jobId: UUIDSchema,
  url: z.string().url(),
  title: z.string().optional(),
  snippet: z.string().optional(),
  domain: z.string(),
  score: z.number().min(0).max(1),
  timestamp: TimestampSchema,
  metadata: z.record(z.any()).optional(),
});

export const DorksPackSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  scope: z.enum(['public', 'france', 'eu', 'custom']),
  risk: z.enum(['low', 'medium', 'high']),
  variables: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    required: z.boolean().default(false),
    default: z.string().optional(),
  })),
  dorks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    query: z.string(),
    risk: z.enum(['low', 'medium', 'high']),
    tags: z.array(z.string()).optional(),
  })),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Export System
export const ExportRequestSchema = z.object({
  jobId: UUIDSchema,
  format: z.enum(['json', 'csv', 'pdf', 'xlsx']),
  options: z.object({
    includeMetadata: z.boolean().default(true),
    compression: z.enum(['none', 'gzip', 'zip']).default('none'),
    password: z.string().optional(),
  }).optional(),
});

export const ExportSchema = z.object({
  id: UUIDSchema,
  jobId: UUIDSchema,
  format: z.enum(['json', 'csv', 'pdf', 'xlsx']),
  status: z.enum(['pending', 'processing', 'ready', 'expired', 'error']),
  downloadUrl: z.string().url().optional(),
  fileSize: z.number().optional(),
  expiresAt: TimestampSchema,
  createdAt: TimestampSchema,
});

// SSE Events
export const SSEEventSchema = z.object({
  id: z.string(),
  event: z.enum(['job.update', 'job.done', 'job.error', 'metrics.update', 'system.alert']),
  data: z.object({
    jobId: UUIDSchema.optional(),
    status: JobStatusSchema.optional(),
    progress: z.number().min(0).max(100).optional(),
    eta: TimestampSchema.optional(),
    payload: z.record(z.any()).optional(),
    error: z.string().optional(),
  }),
  timestamp: TimestampSchema,
});

// API Response Wrappers
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: z.object({
      timestamp: TimestampSchema,
      traceId: z.string().optional(),
      requestId: z.string().optional(),
    }).optional(),
  });

export const PaginatedApiResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationResponseSchema,
    meta: z.object({
      timestamp: TimestampSchema,
      traceId: z.string().optional(),
      requestId: z.string().optional(),
    }).optional(),
  });

// API Endpoints Schemas
export const EndpointSchemas = {
  // Auth
  'POST /auth/login': {
    request: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
    response: ApiResponseSchema(z.object({
      token: z.string(),
      refreshToken: z.string(),
      expiresIn: z.number(),
    })),
  },

  // Jobs
  'GET /jobs': {
    request: PaginationRequestSchema.extend({
      status: JobStatusSchema.optional(),
      type: JobTypeSchema.optional(),
    }),
    response: PaginatedApiResponseSchema(JobSchema),
  },

  'GET /jobs/:id': {
    response: ApiResponseSchema(JobSchema),
  },

  'DELETE /jobs/:id': {
    response: ApiResponseSchema(z.object({ deleted: z.boolean() })),
  },

  // TikTok
  'POST /tiktok/analyze': {
    request: TikTokAnalyzeRequestSchema,
    response: ApiResponseSchema(z.object({
      jobId: UUIDSchema,
      status: JobStatusSchema,
    })),
  },

  'GET /tiktok/sessions': {
    request: PaginationRequestSchema,
    response: PaginatedApiResponseSchema(TikTokSessionSchema),
  },

  'GET /tiktok/sessions/:id': {
    response: ApiResponseSchema(TikTokSessionSchema.extend({
      metrics: z.array(TikTokMetricSchema).optional(),
      messages: z.array(TikTokMessageSchema).optional(),
    })),
  },

  // Dorks
  'POST /dorks/run': {
    request: DorksRunRequestSchema,
    response: ApiResponseSchema(z.object({
      jobId: UUIDSchema,
      status: JobStatusSchema,
    })),
  },

  'GET /dorks/results': {
    request: PaginationRequestSchema.extend({
      jobId: UUIDSchema,
    }),
    response: PaginatedApiResponseSchema(DorksResultSchema),
  },

  'GET /dorks/packs': {
    request: PaginationRequestSchema,
    response: PaginatedApiResponseSchema(DorksPackSchema),
  },

  // Exports
  'POST /exports': {
    request: ExportRequestSchema,
    response: ApiResponseSchema(ExportSchema),
  },

  'GET /exports/:id': {
    response: ApiResponseSchema(ExportSchema),
  },

  // SSE
  'GET /events': {
    request: z.object({
      topics: z.string().optional(), // comma-separated
      jobId: UUIDSchema.optional(),
    }),
    // SSE stream - no response schema
  },
} as const;

// Type Exports
export type Job = z.infer<typeof JobSchema>;
export type TikTokAnalyzeRequest = z.infer<typeof TikTokAnalyzeRequestSchema>;
export type TikTokSession = z.infer<typeof TikTokSessionSchema>;
export type TikTokMetric = z.infer<typeof TikTokMetricSchema>;
export type TikTokMessage = z.infer<typeof TikTokMessageSchema>;
export type DorksRunRequest = z.infer<typeof DorksRunRequestSchema>;
export type DorksResult = z.infer<typeof DorksResultSchema>;
export type DorksPack = z.infer<typeof DorksPackSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;
export type Export = z.infer<typeof ExportSchema>;
export type SSEEvent = z.infer<typeof SSEEventSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;
export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;

// Utility type for endpoint schemas
export type EndpointSchema<T extends keyof typeof EndpointSchemas> = typeof EndpointSchemas[T];