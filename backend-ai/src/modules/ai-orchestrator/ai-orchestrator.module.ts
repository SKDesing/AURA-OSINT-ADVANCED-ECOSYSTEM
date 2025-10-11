import { Module } from '@nestjs/common';
import { AIOrchestratorController } from './ai-orchestrator.controller';
import { AIOrchestratorService } from './ai-orchestrator.service';
import { QwenModule } from '../qwen/qwen.module';
import { ToolRegistryModule } from '../tool-registry/tool-registry.module';
import { InvestigationModule } from '../investigation/investigation.module';

@Module({
  imports: [QwenModule, ToolRegistryModule, InvestigationModule],
  controllers: [AIOrchestratorController],
  providers: [AIOrchestratorService],
  exports: [AIOrchestratorService],
})
export class AIOrchestratorModule {}