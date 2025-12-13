import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAnalyticsDto } from './analytics.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('create')
  async create(@Body() dto: CreateAnalyticsDto) {
    return this.analyticsService.create(dto);
  }

  // --- ADMIN ENDPOINTS ---

  @Get('admin/traffic')
  async getTraffic() {
    return this.analyticsService.getDailyTraffic();
  }

  @Get('admin/top-products')
  async getTopProducts() {
    return this.analyticsService.getTopProducts();
  }

  @Get('admin/activity')
  async getRecentActivity() {
    return this.analyticsService.getRecentActivity();
  }
}