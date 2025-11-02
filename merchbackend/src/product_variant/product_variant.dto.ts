import { IsInt, IsString, IsBoolean, IsOptional, IsDecimal, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @IsInt()
  product_id: number;

  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsString()
  material: string;

  @IsString()
  sku: string;

  @Type(() => Number)
  @IsDecimal()
  price: number;

  @IsInt()
  stock_quantity: number;

  @IsInt()
  low_stock_threshold: number;

  @Type(() => Number)
  @IsDecimal()
  weight: number;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean = true;
}
