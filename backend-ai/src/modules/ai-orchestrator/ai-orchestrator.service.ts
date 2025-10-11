import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { QwenService } from '../qwen/qwen.service';
import { ToolRegistryService } from '../tool-registry/tool-registry.service';
import { InvestigationService } from '../investigation/investigation.service';

interface QueryIntent {
  type: 'profile' | 'domain' | 'person' | 'hashtag';
  target: string;
  platforms?: string[];
  depth?: 'quick' | 'standard' | 'deep';
}

interface InvestigationPlan {
  tools: Array<{
    name: string;
    input: any;
    priority: number;
  }>;
  estimatedTime: number;
  strategy: string;
}

@Injectable()
export class AIOrchestratorService {
  private readonly logger = new Logger(AIOrchestratorService.name);
  private progressStreams = new Map<string, Subject<MessageEvent>>();

  constructor(
    private qwenService: QwenService,
    private toolRegistry: ToolRegistryService,
    private investigationService: InvestigationService,
    private eventEmitter: EventEmitter2,
  ) {}

  async startInvestigation(query: string, userId: string) {
    const investigationId = uuidv4();
    
    this.logger.log(`Starting investigation ${investigationId} for user ${userId}`);

    // 1. Parse intent
    const intent = await this.parseUserQuery(query);
    
    // 2. Create plan
    const plan = await this.createInvestigationPlan(intent);
    
    // 3. Save investigation
    await this.investigationService.create({
      title: query,
      data: { intent, plan, userId },
    });

    // 4. Execute async
    this.executeInvestigation(plan, investigationId, userId);

    return {
      investigationId,
      plan: {
        tools: plan.tools.map(t => t.name),
        estimatedTime: plan.estimatedTime,
        strategy: plan.strategy,
      },
    };
  }

  private async parseUserQuery(query: string): Promise<QueryIntent> {
    const systemPrompt = `Analyse cette requête OSINT et extrais l'intent en JSON:
{
  "type": "profile|domain|person|hashtag",
  "target": "cible_principale",
  "platforms": ["tiktok", "instagram"],
  "depth": "quick|standard|deep"
}`;

    const response = await this.qwenService.generateCompletion(query, systemPrompt);
    return JSON.parse(response);
  }

  private async createInvestigationPlan(intent: QueryIntent): Promise<InvestigationPlan> {
    const availableTools = await this.toolRegistry.getToolsForIntent(intent);
    
    const systemPrompt = `Crée un plan d'investigation optimal en JSON:
{
  "tools": [{"name": "tool_name", "input": {}, "priority": 1}],
  "estimatedTime": 180,
  "strategy": "description"
}`;

    const response = await this.qwenService.generateCompletion(
      JSON.stringify({ intent, availableTools }),
      systemPrompt
    );
    
    return JSON.parse(response);
  }

  private async executeInvestigation(plan: InvestigationPlan, investigationId: string, userId: string) {
    const progressSubject = new Subject<MessageEvent>();
    this.progressStreams.set(investigationId, progressSubject);

    let completedTools = 0;
    const totalTools = plan.tools.length;

    for (const toolConfig of plan.tools) {
      try {
        // Emit progress
        this.emitProgress(investigationId, {
          currentTool: toolConfig.name,
          percentage: Math.round((completedTools / totalTools) * 100),
        });

        // Execute tool
        const tool = await this.toolRegistry.getTool(toolConfig.name);
        const result = await tool.execute(toolConfig.input);

        // Save result (mock for now)
        this.logger.log(`Tool ${toolConfig.name} completed with result`);

        completedTools++;
      } catch (error) {
        this.logger.error(`Tool ${toolConfig.name} failed:`, error);
      }
    }

    // Generate final report
    await this.generateReport(investigationId);
    
    this.emitProgress(investigationId, {
      currentTool: 'Completed',
      percentage: 100,
      completed: true,
    });

    this.progressStreams.delete(investigationId);
  }

  private async generateReport(investigationId: string) {
    const systemPrompt = `Génère un rapport OSINT complet en Markdown`;

    const report = await this.qwenService.generateCompletion(
      'Generate investigation report',
      systemPrompt
    );

    this.logger.log(`Report generated for investigation ${investigationId}`);
  }

  streamProgress(investigationId: string): Observable<MessageEvent> {
    const subject = this.progressStreams.get(investigationId);
    if (!subject) {
      throw new Error('Investigation not found');
    }
    return subject.asObservable();
  }

  private emitProgress(investigationId: string, data: any) {
    const subject = this.progressStreams.get(investigationId);
    if (subject) {
      subject.next({
        data: JSON.stringify(data),
      } as MessageEvent);
    }
  }
}