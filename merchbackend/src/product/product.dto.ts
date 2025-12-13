import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateProductVariantDto } from 'src/product_variant/product_variant.dto';
import { CreateProductImageDto } from 'src/product_image/product_image.dto';

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

  @IsNumber()
  base_price: number;

  @IsString()
  sku: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_active?: boolean = true;

  // --- NEW: Allow Nested Creation ---
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}