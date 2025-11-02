import { IsInt, IsNumber, IsDateString } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateOrderItemDto {
  @IsInt()
  order_id: number;

  @IsInt()
  product_id: number;

  @IsInt()
  product_variant_id: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  unit_price: Decimal;

  @IsNumber()
  discount_amount: Decimal;

  @IsNumber()
  tax_amount: Decimal;

  @IsNumber()
  total_price: Decimal;
}
