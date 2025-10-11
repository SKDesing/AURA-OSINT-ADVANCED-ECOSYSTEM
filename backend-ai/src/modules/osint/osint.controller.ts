import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OsintService } from './osint.service';
import { CreateInvestigationDto } from './dto/create-investigation.dto';

@ApiTags('OSINT')
@Controller('api/osint')
export class OsintController {
  constructor(private readonly osintService: OsintService) {}

  @Post('investigations')
  @ApiOperation({ summary: 'Start new OSINT investigation' })
  @HttpCode(HttpStatus.ACCEPTED)
  async startInvestigation(@Body() dto: CreateInvestigationDto) {
    const investigation = await this.osintService.startInvestigation(dto);
    return {
      status: 'accepted',
      investigation_id: investigation.id,
      message: 'Investigation started in background',
    };
  }

  @Get('investigations/:id')
  @ApiOperation({ summary: 'Get investigation details' })
  async getInvestigation(@Param('id') id: string) {
    return this.osintService.getInvestigation(id);
  }

  @Get('investigations')
  @ApiOperation({ summary: 'List all investigations' })
  async listInvestigations() {
    return this.osintService.listInvestigations();
  }

  @Post('callback/:investigationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Callback from orchestrator (internal)' })
  async handleCallback(
    @Param('investigationId') investigationId: string,
    @Body() toolData: any,
  ) {
    await this.osintService.handleToolCallback(investigationId, toolData);
    return { status: 'ok' };
  }
}