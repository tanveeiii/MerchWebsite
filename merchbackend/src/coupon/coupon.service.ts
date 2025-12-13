import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCouponDto } from './coupon.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE COUPON
  async create(createCouponDto: CreateCouponDto) {
    // Check if code exists
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { coupon_code: createCouponDto.coupon_code },
    });
    if (existingCoupon)
      throw new BadRequestException({ code: 400, message: 'Coupon code already exists' });

    const now = new Date();
    // FIX: Correctly convert number to Prisma Decimal
    const discountVal = new Decimal(createCouponDto.discount_value);

    try {
      const coupon = await this.prisma.coupon.create({
        data: {
          coupon_code: createCouponDto.coupon_code.toUpperCase(), // Store uppercase
          description: createCouponDto.description,
          discount_type: createCouponDto.discount_type,
          discount_value: discountVal,
          min_purchase_amount: createCouponDto.min_purchase_amount,
          max_purchase_amount: createCouponDto.max_purchase_amount,
          usage_limit: createCouponDto.usage_limit,
          usage_count: 0,
          is_active: true,
          start_date: new Date(createCouponDto.start_date),
          end_date: new Date(createCouponDto.end_date),
          created_at: now,
        },
      });
      return coupon;
    } catch (e) {
      throw new InternalServerErrorException("Failed to create coupon");
    }
  }

  // 2. ADMIN: FETCH ALL COUPONS (Including inactive)
  async findAllAdmin() {
    try {
      return await this.prisma.coupon.findMany({
        orderBy: { created_at: 'desc' }
      });
    } catch (e) {
      throw new InternalServerErrorException("Error fetching coupons");
    }
  }

  // 3. ADMIN: DELETE COUPON
  async delete(id: number) {
    try {
        return await this.prisma.coupon.delete({ where: { coupon_id: id } });
    } catch(e) {
        throw new NotFoundException("Coupon not found or could not be deleted");
    }
  }

  // 4. ADMIN: TOGGLE STATUS (Active/Inactive)
  async toggleStatus(id: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { coupon_id: id }});
    if(!coupon) throw new NotFoundException("Coupon not found");

    return await this.prisma.coupon.update({
        where: { coupon_id: id },
        data: { is_active: !coupon.is_active }
    });
  }

  // 5. PUBLIC: APPLY COUPON (Logic for Cart)
  async applyCoupon(code: string, orderTotal: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { coupon_code: code.toUpperCase() },
    });

    // Validations
    if (!coupon) throw new NotFoundException('Invalid coupon code');
    if (!coupon.is_active) throw new BadRequestException('Coupon is inactive');

    const now = new Date();
    if (coupon.start_date > now) throw new BadRequestException('Coupon is not active yet');
    if (coupon.end_date < now) throw new BadRequestException('Coupon has expired');

    if (coupon.usage_limit > 0 && coupon.usage_count >= coupon.usage_limit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (orderTotal < coupon.min_purchase_amount) {
      throw new BadRequestException(`Minimum purchase of $${coupon.min_purchase_amount} required`);
    }

    // Calculate Discount
    let discountAmount = 0;
    const value = Number(coupon.discount_value);

    if (coupon.discount_type === 'PERCENTAGE') {
        discountAmount = (orderTotal * value) / 100;
        // Cap discount at max_purchase_amount if used as max cap (optional logic)
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