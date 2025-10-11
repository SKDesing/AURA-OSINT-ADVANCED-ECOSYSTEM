import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InvestigationService {
  private readonly logger = new Logger(InvestigationService.name);
  private investigations = new Map();
  private toolResults = new Map();

  async create(data: any): Promise<any> {
    const investigation = {
      ...data,
      createdAt: new Date(),
      status: 'running',
    };
    
    this.investigations.set(data.id, investigation);
    return investigation;
  }

  async findOne(id: string): Promise<any> {
    return this.investigations.get(id);
  }

  async saveToolResult(investigationId: string, toolName: string, result: any): Promise<any> {
    const toolResult = {
      investigationId,
      toolName,
      result,
      executedAt: new Date(),
    };
    
    const key = `${investigationId}-${toolName}`;
    this.toolResults.set(key, toolResult);
    return toolResult;
  }

  async getToolResults(investigationId: string): Promise<any[]> {
    const results = [];
    for (const [key, result] of this.toolResults.entries()) {
      if (key.startsWith(investigationId)) {
        results.push(result);
      }
    }
    return results;
  }

  async saveReport(investigationId: string, report: string): Promise<void> {
    const investigation = this.investigations.get(investigationId);
    if (investigation) {
      investigation.report = report;
      investigation.status = 'completed';
      investigation.completedAt = new Date();
    }
  }

  async updateStatus(investigationId: string, status: string): Promise<void> {
    const investigation = this.investigations.get(investigationId);
    if (investigation) {
      investigation.status = status;
    }
  }
}