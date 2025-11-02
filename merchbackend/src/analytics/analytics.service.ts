import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAnalyticsDto } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAnalyticsDto) {
    // return this.prisma.userNotification.create();
  }
}
