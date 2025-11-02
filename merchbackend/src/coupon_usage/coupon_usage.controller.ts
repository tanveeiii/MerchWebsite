import { Body, Controller, Post } from '@nestjs/common';
import { CouponUsageService } from './coupon_usage.service';
import { CreateCouponUsageDto } from './coupon_usage.dto';

@Controller('coupon_usage')
export class CouponUsageController {
  constructor(private readonly couponUsageService: CouponUsageService) {}

  @Post('add')
  async create(@Body() dto: CreateCouponUsageDto) {
    return this.couponUsageService.create(dto);
  }
}
