import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCouponUsageDto } from './coupon_usage.dto';

@Injectable()
export class CouponUsageService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCouponUsageDto) {
    // return this.prisma.userNotification.create();
  }
}
