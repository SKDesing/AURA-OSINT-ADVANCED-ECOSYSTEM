/**
 * AURA OSINT Shared Constants
 */

// AI Configuration
export const AI_DEFAULTS = {
  MAX_INPUT_CHARS: 6000,
  MAX_OUTPUT_CHARS: 8000,
  QWEN_PORT: 8090,
  GATEWAY_PORT: 4010,
  CONTEXT_SIZE: 3072,
} as const;

// Harassment Categories
export const HARASSMENT_CATEGORIES = [
  'threats',
  'insults', 
  'doxxing',
  'sexualHarassment',
  'cyberbullying',
  'normal'
] as const;

// OSINT Platforms
export const OSINT_PLATFORMS = [
  'tiktok',
  'facebook',
  'instagram', 
  'twitter',
  'multi_platform'
] as const;

// Performance Targets
export const PERFORMANCE_TARGETS = {
  LATENCY_P95_MS: 2500,
  HARASSMENT_RECALL: 0.8,
  HARASSMENT_PRECISION: 0.7,
  BLOCKED_RATIO_MAX: 0.05,
} as const;