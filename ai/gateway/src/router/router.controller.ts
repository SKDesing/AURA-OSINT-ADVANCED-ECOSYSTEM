import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { RouterService } from './router.service';
import { RouterDecisionDto, RouterDiagnoseDto } from './router.dto';
import { DevOnlyGuard } from '../guards/dev-only.guard';

@Controller('ai/router')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  @Post('decide')
  async decide(@Body() body: RouterDecisionDto) {
    return this.routerService.makeDecision(
      body.prompt,
      body.lexical_score || 0,
      body.language || 'fr'
    );
  }

  @Get('metrics')
  async getMetrics() {
    return this.routerService.getMetrics();
  }

  @Post('diagnose')
  @UseGuards(DevOnlyGuard)
  async diagnose(@Body() body: RouterDiagnoseDto) {
    return this.routerService.diagnose(body.prompt, body.expected_algorithm);
  }
}