import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  async create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get('admin/all')
  async findAllAdmin() {
    return this.couponService.findAllAdmin();
  }

  @Post('apply')
  async apply(@Body() body: { code: string; orderTotal: number }) {
    return this.couponService.applyCoupon(body.code, body.orderTotal);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.delete(id);
  }

  @Patch('toggle/:id')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.toggleStatus(id);
  }
}