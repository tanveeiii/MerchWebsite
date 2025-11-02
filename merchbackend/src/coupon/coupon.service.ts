import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCouponDto } from './coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { coupon_code: createCouponDto.coupon_code },
    });
    if (existingCoupon)
      throw new BadRequestException({
        code: 400,
        message: 'Coupon code already exists',
      });
    const now = new Date();
    const coupon = await this.prisma.coupon.create({
      data: {
        coupon_code: createCouponDto.coupon_code,
        description: createCouponDto.description,
        discount_type: createCouponDto.discount_type,
        min_purchase_amount: createCouponDto.min_purchase_amount,
        max_purchase_amount: createCouponDto.max_purchase_amount,
        usage_limit: createCouponDto.usage_limit,
        usage_count: createCouponDto.usage_count || 0,
        is_active: createCouponDto.is_active,
        start_date: createCouponDto.start_date,
        end_date: createCouponDto.end_date,
        created_at: now,
      },
      select: {
        coupon_id: true,
        coupon_code: true,
        discount_type: true,
        min_purchase_amount: true,
        max_purchase_amount: true,
        usage_count: true,
        usage_limit: true,
        is_active: true,
        start_date: true,
        end_date: true,
      },
    });

    return coupon;
  }
}
