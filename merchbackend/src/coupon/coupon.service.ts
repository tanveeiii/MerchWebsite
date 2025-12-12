import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCouponDto } from './coupon.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  // 1. Create Coupon
  async create(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { coupon_code: createCouponDto.coupon_code },
    });
    if (existingCoupon)
      throw new BadRequestException({ code: 400, message: 'Coupon code already exists' });

    const now = new Date();
    
    // FIX: Convert the incoming number to a Decimal for the database
    const discountVal = new Decimal(createCouponDto.discount_value);

    const coupon = await this.prisma.coupon.create({
      data: {
        coupon_code: createCouponDto.coupon_code,
        description: createCouponDto.description,
        discount_type: createCouponDto.discount_type,
        discount_value: discountVal, // <--- Now Valid
        min_purchase_amount: createCouponDto.min_purchase_amount,
        max_purchase_amount: createCouponDto.max_purchase_amount,
        usage_limit: createCouponDto.usage_limit,
        usage_count: createCouponDto.usage_count || 0,
        is_active: createCouponDto.is_active ?? true,
        start_date: createCouponDto.start_date,
        end_date: createCouponDto.end_date,
        created_at: now,
      },
    });

    return coupon;
  }

  // 2. Fetch All
  async fetch() {
    try {
      const coupons = await this.prisma.coupon.findMany();
      return { code: 200, coupons, message: "Coupons data extracted successfully" };
    } catch (e) {
      throw new InternalServerErrorException({ code: 400, message: "Error fetching coupons", error_message: e?.message });
    }
  }

  // 3. Validate & Apply Coupon
  async applyCoupon(code: string, orderTotal: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { coupon_code: code },
    });

    if (!coupon) throw new NotFoundException('Invalid coupon code');
    if (!coupon.is_active) throw new BadRequestException('Coupon is inactive');

    const now = new Date();
    if (new Date(coupon.start_date) > now) throw new BadRequestException('Coupon is not active yet');
    if (new Date(coupon.end_date) < now) throw new BadRequestException('Coupon has expired');

    if (coupon.usage_limit > 0 && coupon.usage_count >= coupon.usage_limit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (orderTotal < coupon.min_purchase_amount) {
      throw new BadRequestException(`Minimum purchase of $${coupon.min_purchase_amount} required`);
    }

    // Calculate Discount
    let discountAmount = 0;
    // FIX: Convert Decimal from DB back to Number for calculation
    const value = Number(coupon.discount_value);

    if (coupon.discount_type === 'PERCENTAGE') {
        discountAmount = (orderTotal * value) / 100;
        
        // Optional: Check Max Discount Amount if needed
        if (coupon.max_purchase_amount > 0 && discountAmount > coupon.max_purchase_amount) {
             // Sometimes max_purchase_amount is used as "Max Discount Cap" in simple schemas
             // If you meant it strictly as purchase ceiling, ignore this block.
        }
    } else {
        discountAmount = value;
    }

    // Ensure discount doesn't exceed total
    if (discountAmount > orderTotal) discountAmount = orderTotal;

    return {
        code: 200,
        message: 'Coupon Applied',
        data: {
            coupon_id: coupon.coupon_id,
            discount_amount: parseFloat(discountAmount.toFixed(2)),
            coupon_code: coupon.coupon_code
        }
    };
  }
}