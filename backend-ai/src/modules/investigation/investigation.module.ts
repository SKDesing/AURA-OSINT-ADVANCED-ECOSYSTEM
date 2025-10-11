import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestigationService } from './investigation.service';
import { InvestigationController } from './investigation.controller';
import { Investigation } from './entities/investigation.entity';
import { ToolResult } from './entities/tool-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investigation, ToolResult])],
  controllers: [InvestigationController],
  providers: [InvestigationService],
  exports: [InvestigationService],
})
export class InvestigationModule {}