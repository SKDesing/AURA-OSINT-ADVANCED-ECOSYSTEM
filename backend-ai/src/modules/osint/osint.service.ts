import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Investigation, InvestigationStatus } from './entities/investigation.entity';
import { OsintExecution, ExecutionStatus } from './entities/osint-execution.entity';
import { OsintGateway } from './osint.gateway';
import { CreateInvestigationDto } from './dto/create-investigation.dto';

@Injectable()
export class OsintService {
  private readonly logger = new Logger(OsintService.name);
  private readonly ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:8000';

  constructor(
    @InjectRepository(Investigation)
    private investigationRepo: Repository<Investigation>,
    @InjectRepository(OsintExecution)
    private executionRepo: Repository<OsintExecution>,
    private httpService: HttpService,
    private osintGateway: OsintGateway,
  ) {}

  async startInvestigation(dto: CreateInvestigationDto): Promise<Investigation> {
    const investigation = this.investigationRepo.create({
      ...dto,
      status: InvestigationStatus.PENDING,
    });
    await this.investigationRepo.save(investigation);

    this.logger.log(`Investigation ${investigation.id} created`);
    this.executeInBackground(investigation.id, dto);

    return investigation;
  }

  private async executeInBackground(
    investigationId: string,
    dto: CreateInvestigationDto,
  ): Promise<void> {
    try {
      await this.investigationRepo.update(investigationId, {
        status: InvestigationStatus.RUNNING,
      });

      this.osintGateway.sendProgress(investigationId, {
        status: 'running',
        message: 'Investigation started',
        progress: 0,
      });

      const response = await firstValueFrom(
        this.httpService.post(`${this.ORCHESTRATOR_URL}/api/v1/investigations/start`, {
          ...dto,
          callback_url: `http://localhost:3000/api/osint/callback/${investigationId}`,
        }),
      );

      await this.investigationRepo.update(investigationId, {
        status: InvestigationStatus.COMPLETED,
        summary: response.data.summary,
        report_url: response.data.report_url,
      });

      this.osintGateway.sendProgress(investigationId, {
        status: 'completed',
        message: 'Investigation completed',
        progress: 100,
        report_url: response.data.report_url,
      });

    } catch (error) {
      this.logger.error(`Investigation ${investigationId} failed: ${error.message}`);

      await this.investigationRepo.update(investigationId, {
        status: InvestigationStatus.FAILED,
        summary: { error: error.message },
      });

      this.osintGateway.sendProgress(investigationId, {
        status: 'failed',
        message: error.message,
        progress: 0,
      });
    }
  }

  async handleToolCallback(investigationId: string, toolData: any): Promise<void> {
    const execution = this.executionRepo.create({
      investigation_id: investigationId,
      tool_name: toolData.tool_name,
      tool_category: toolData.category,
      status: toolData.status as ExecutionStatus,
      duration_seconds: toolData.metrics?.duration,
      cpu_percent: toolData.metrics?.cpu_percent,
      memory_mb: toolData.metrics?.memory_mb,
      confidence_score: toolData.confidence_score,
      data: toolData.data,
      error_message: toolData.metrics?.error_message,
    });

    await this.executionRepo.save(execution);

    this.osintGateway.sendProgress(investigationId, {
      status: 'tool_completed',
      tool: toolData.tool_name,
      progress: toolData.progress_percent,
      data: toolData.data,
    });
  }

  async getInvestigation(id: string): Promise<Investigation> {
    return this.investigationRepo.findOne({
      where: { id },
      relations: ['executions'],
    });
  }

  async listInvestigations(limit = 50): Promise<Investigation[]> {
    return this.investigationRepo.find({
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}