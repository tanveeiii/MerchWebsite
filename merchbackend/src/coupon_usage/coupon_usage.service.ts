import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCouponUsageDto } from './coupon_usage.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CouponUsageService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponUsageDto: CreateCouponUsageDto) {
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { coupon_id: Number(createCouponUsageDto.coupon_id) },
    });
    
    if (!existingCoupon)
      throw new BadRequestException({ code: 400, message: 'Coupon does not exist' });
    
    const now = new Date();
    
    // 1. Create Usage Record
    const couponUsage = await this.prisma.couponUsage.create({
      data: {
        coupon_id: existingCoupon.coupon_id,
        order_id: Number(createCouponUsageDto.order_id),
        user_id: Number(createCouponUsageDto.user_id),
        used_at: now,
        // FIX: Must use 'new Decimal()'
        discount_applied: new Decimal(createCouponUsageDto.discount_applied),
      },
    });

    // 2. Increment Usage Count on Coupon
    await this.prisma.coupon.update({
        where: { coupon_id: existingCoupon.coupon_id },
        data: { usage_count: { increment: 1 } }
    });

    return couponUsage;
  }
}