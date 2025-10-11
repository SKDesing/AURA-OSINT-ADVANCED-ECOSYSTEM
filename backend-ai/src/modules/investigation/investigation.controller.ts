import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InvestigationService } from './investigation.service';

@Controller('investigations')
export class InvestigationController {
  constructor(private readonly investigationService: InvestigationService) {}

  @Get()
  async findAll() {
    return this.investigationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.investigationService.findOne(id);
  }

  @Post()
  async create(@Body() createData: { title: string; data?: any }) {
    return this.investigationService.create(createData);
  }
}