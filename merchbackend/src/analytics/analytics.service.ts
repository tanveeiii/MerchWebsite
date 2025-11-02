import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAnalyticsDto } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async create(createAnalyticsDto: CreateAnalyticsDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createAnalyticsDto.email },
    });
    if (!user)
      throw new BadRequestException({
        code: 400,
        message: 'User does not exist',
      });
    const now = new Date();
    const analytics = await this.prisma.analytics.create({
      data: {
        user_id: user.user_id,
        product_id: createAnalyticsDto.product_id,
        event_type: createAnalyticsDto.event_type,
        event_data: createAnalyticsDto.event_data || '',
        ip_address: createAnalyticsDto.ip_address,
        page_url: '',
        created_at: now,
      },
    });

    return analytics;
  }
}
