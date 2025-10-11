import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investigation } from './entities/investigation.entity';
import { ToolResult } from './entities/tool-result.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class InvestigationService {
  private readonly logger = new Logger(InvestigationService.name);

  constructor(
    @InjectRepository(Investigation)
    private investigationRepo: Repository<Investigation>,
    @InjectRepository(ToolResult)
    private toolResultRepo: Repository<ToolResult>,

  ) {}

  async findAll(): Promise<Investigation[]> {
    return this.investigationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Investigation> {
    return this.investigationRepo.findOne({
      where: { id },
      relations: ['toolResults'],
    });
  }

  async create(data: { title: string; data?: any }): Promise<Investigation> {
    const investigation = this.investigationRepo.create({
      title: data.title,
      data: data.data,
      status: 'active',
    });
    
    return this.investigationRepo.save(investigation);
  }

  // Profile methods removed - will be handled separately
}