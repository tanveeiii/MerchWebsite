import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCustomizationDto {
  @IsInt()
  cart_id: number; // <--- MUST BE 'cart_id'

  @IsOptional()
  @IsString()
  front_image_url?: string;

  @IsOptional()
  @IsString()
  back_image_url?: string;

  @IsOptional()
  @IsString()
  custom_text?: string;

  @IsOptional()
  @IsString()
  font_style?: string;

  @IsOptional()
  @IsString()
  text_color?: string;
}