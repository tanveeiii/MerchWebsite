import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  product_name: string;

  @Type(() => Number)
  @IsInt()
  tag_id: number;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsInt()
  category_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  base_price: number;

  @IsString()
  sku: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
