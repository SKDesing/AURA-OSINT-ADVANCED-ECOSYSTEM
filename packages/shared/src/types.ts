/**
 * AURA OSINT Shared Types
 * Common type definitions across the ecosystem
 */

// Harassment Detection Types
export interface HarassmentResult {
  engine: string;
  engine_version: string;
  is_match: boolean;
  score: number;
  severity: number;
  category: string;
  evidence: string[];
  confidence: number;
  explanation: string;
  meta: {
    processing_ms: number;
    latency_ms: number;
    error?: boolean;
  };
}

// LLM Generation Types
export interface LlmGenerationResponse {
  status: 'ok' | 'rejected' | 'error';
  model: string;
  model_hash?: string;
  engine_version: string;
  request_id: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  content_type: 'structured' | 'free';
  data: { text: string };
  meta: {
    prompt_hash: string;
    output_hash: string;
    policy: { blocked: boolean; reason?: string };
  };
}

// OSINT Profile Types
export interface OSINTProfile {
  id: string;
  platform: 'tiktok' | 'facebook' | 'instagram' | 'twitter';
  username: string;
  display_name?: string;
  risk_score?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}