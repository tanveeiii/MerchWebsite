import { IsInt, IsNumber, IsDateString, IsIn, IsOptional } from 'class-validator';
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
  @IsOptional()@IsNumber()
  tax_amount: number;
  @IsOptional()@IsNumber()
  discount_amount: number;
}
