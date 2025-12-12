import { Body, Get, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  async create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get('fetch')
  async fetch() {
    return this.couponService.fetch();
  }

  // --- NEW Endpoint ---
  @Post('apply')
  async apply(@Body() body: { code: string; orderTotal: number }) {
    return this.couponService.applyCoupon(body.code, body.orderTotal);
  }
}