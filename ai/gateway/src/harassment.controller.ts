import { Controller, Post, Body } from '@nestjs/common';
import { HarassmentService } from './harassment.service';

interface AnalyzeRequest {
  text: string;
  context?: {
    userProfile?: {
      previousViolations?: number;
      accountAge?: number;
    };
  };
}

@Controller('ai/harassment')
export class HarassmentController {
  constructor(private readonly service: HarassmentService) {}

  @Post('analyze')
  async analyze(@Body() request: AnalyzeRequest) {
    return this.service.analyze(request.text, request.context);
  }
}