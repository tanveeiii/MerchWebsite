import { IsInt, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @IsOptional() // Make Optional for Nested Creation
  @IsInt()
  product_id?: number;

  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsString()
  material: string;

  @IsString()
  sku: string;

  @Type(() => Number)
  @IsNumber() // Changed from IsDecimal to IsNumber for better DTO handling
  price: number;

  @IsInt()
  stock_quantity: number;

  @IsInt()
  low_stock_threshold: number;

  @Type(() => Number)
  @IsNumber() // Changed from IsDecimal to IsNumber
  weight: number;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean = true;
}