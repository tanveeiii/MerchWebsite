import {
  IsInt,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateOrderDto {
  @IsString()
  order_number: string;

  @IsInt()
  shipping_address: number;

  @IsNumber()
  subtotal: Decimal;

  @IsNumber()
  tax_amount: Decimal;

  @IsNumber()
  shipping_cost: Decimal;

  @IsNumber()
  discount_amount: Decimal;

  @IsNumber()
  total_amount: Decimal;

  @IsString()
  payment_type: string;

  @IsString()
  order_status: string;

  @IsInt()
  user_id: number;
}
