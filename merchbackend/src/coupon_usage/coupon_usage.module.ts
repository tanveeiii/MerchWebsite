import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CouponUsageController } from './coupon_usage.controller';
import { CouponUsageService } from './coupon_usage.service';

@Module({
  controllers: [CouponUsageController],
  providers: [CouponUsageService, PrismaService],
})
export class CouponUsageModule {}
