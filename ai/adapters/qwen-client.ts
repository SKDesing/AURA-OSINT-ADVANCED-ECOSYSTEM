import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface QwenResponse {
  status: string;
  model: string;
  engine_version: string;
  request_id: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  content_type: string;
  data: { text: string };
  meta: {
    prompt_hash: string;
    output_hash: string;
    policy: { blocked: boolean; reason?: string };
  };
}

export interface QwenRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  structured?: boolean;
}

class QwenClient {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = `http://127.0.0.1:${process.env.AI_QWEN_PORT || 8090}`;
    this.model = 'qwen2-1_5b-instruct-q4_k_m';
  }

  async generate(request: QwenRequest): Promise<QwenResponse> {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      const response = await fetch(`${this.baseUrl}/completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: request.prompt,
          n_predict: request.max_tokens || 512,
          temperature: request.temperature || 0.2,
          stop: ['</s>', '\n\n'],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      
      return {
        status: 'ok',
        model: this.model,
        engine_version: '1.0.0',
        request_id: requestId,
        input_tokens: this.estimateTokens(request.prompt),
        output_tokens: this.estimateTokens(data.content || ''),
        latency_ms: latency,
        content_type: request.structured ? 'structured' : 'free',
        data: { text: data.content || '' },
        meta: {
          prompt_hash: this.hashText(request.prompt),
          output_hash: this.hashText(data.content || ''),
          policy: { blocked: false },
        },
      };
    } catch (error) {
      return {
        status: 'error',
        model: this.model,
        engine_version: '1.0.0',
        request_id: requestId,
        input_tokens: 0,
        output_tokens: 0,
        latency_ms: Date.now() - startTime,
        content_type: 'free',
        data: { text: '' },
        meta: {
          prompt_hash: this.hashText(request.prompt),
          output_hash: '',
          policy: { blocked: true, reason: error.message },
        },
      };
    }
  }

  private hashText(text: string): string {
    return 'sha256:' + crypto.createHash('sha256').update(text).digest('hex');
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { 
        method: 'GET',
        timeout: 5000 
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const qwenClient = new QwenClient();
export { QwenClient };