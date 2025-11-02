import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto as CreateCouponDto } from './coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  async create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }
}
