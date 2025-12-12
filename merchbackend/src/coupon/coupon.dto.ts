import {
  IsString,
  IsInt,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  coupon_code: string;

  @IsString()
  description: string;

  @IsString()
  discount_type: string; // e.g., 'PERCENTAGE' or 'FLAT'

  @IsNumber()
  discount_value: number; // <--- ADDED THIS

  @IsInt()
  min_purchase_amount: number;

  @IsInt()
  max_purchase_amount: number;

  @IsInt()
  usage_limit: number;

  @IsOptional()
  @IsInt()
  usage_count?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}