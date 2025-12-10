import { IsInt, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  order_number: string;

  @IsInt()
  shipping_address: number;

  @IsString()
  subtotal: string;

  @IsString()
  tax_amount: string;

  @IsString()
  shipping_cost: string;

  @IsString()
  discount_amount: string;

  @IsString()
  total_amount: string;

  @IsString()
  payment_type: string;

  @IsString()
  order_status: string;

  @IsInt()
  user_id: number;
}
