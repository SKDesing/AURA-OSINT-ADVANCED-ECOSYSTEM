import { Controller, Post, Body, Sse, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AIOrchestratorService } from './ai-orchestrator.service';
import { StartInvestigationDto } from './dto/start-investigation.dto';

@Controller('investigation')
export class AIOrchestratorController {
  constructor(private readonly aiOrchestrator: AIOrchestratorService) {}

  @Post('start')
  async startInvestigation(@Body() dto: StartInvestigationDto) {
    return this.aiOrchestrator.startInvestigation(dto.query, dto.userId);
  }

  @Sse('stream/:investigationId')
  streamProgress(@Param('investigationId') investigationId: string): Observable<MessageEvent> {
    return this.aiOrchestrator.streamProgress(investigationId);
  }
}