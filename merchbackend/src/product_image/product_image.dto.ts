import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductImageDto {
  @IsInt()
  product_id: number;

  @IsString()
  image_url: string;

  @IsString()
  alt_text: string;

  @IsInt()
  display_order: number;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean = false;
}
