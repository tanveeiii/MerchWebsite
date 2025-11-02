import { IsInt, IsNumber, IsDateString } from 'class-validator';

export class CreateCouponUsageDto {
  @IsInt()
  coupon_id: number;

  @IsInt()
  order_id: number;

  @IsInt()
  user_id: number;

  @IsNumber()
  discount_applied: number;
}
