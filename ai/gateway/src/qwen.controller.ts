import { Controller, Post, Body } from '@nestjs/common';
import { QwenService } from './qwen.service';

interface GenerateRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  structured?: boolean;
}

@Controller('ai/local/qwen')
export class QwenController {
  constructor(private readonly service: QwenService) {}

  @Post('generate')
  async generate(@Body() request: GenerateRequest) {
    return this.service.generate(request);
  }

  @Post('health')
  async health() {
    const isHealthy = await this.service.healthCheck();
    return { status: isHealthy ? 'ok' : 'error', service: 'qwen-local' };
  }
}