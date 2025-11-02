import { Body, Controller, Post } from '@nestjs/common';
import { CreateAnalyticsDto } from './analytics.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('add')
  async create(@Body() dto: CreateAnalyticsDto) {
    return this.analyticsService.create(dto);
  }
}
