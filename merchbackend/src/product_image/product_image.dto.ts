import { IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @IsOptional() // Make Optional for Nested Creation
  @IsInt()
  product_id?: number;

  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  alt_text?: string;

  @IsInt()
  display_order: number;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean = false;
}