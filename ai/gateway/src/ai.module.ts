import { Module } from '@nestjs/common';
import { QwenController } from './qwen.controller';
import { QwenService } from './qwen.service';
import { HarassmentController } from './harassment.controller';
import { HarassmentService } from './harassment.service';
import { InputGuardService } from './guardrails/input-guard';
import { OutputGuardService } from './guardrails/output-guard';

@Module({
  controllers: [QwenController, HarassmentController],
  providers: [
    QwenService,
    HarassmentService,
    InputGuardService,
    OutputGuardService,
  ],
})
export class AiModule {}