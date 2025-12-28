import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  order_number: string;
  @IsInt()
  shipping_address: number;
  @IsNumber()
  subtotal: number;
  @IsNumber()
  discount_amount: number;
  @IsNumber()
  total_amount: number;
  @IsString()
  payment_type: string;
  @IsString()
  order_status: string;
  @IsInt()
  user_id: number;
  @IsOptional()@IsString()
  razorpay_order_id: string;
  @IsOptional()@IsString()
  razorpay_payment_id: string;
  @IsOptional()@IsNumber()
  tax_amount: number;
  @IsOptional()@IsNumber()
  shipping_cost: number;
}
