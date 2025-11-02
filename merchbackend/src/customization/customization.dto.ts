import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCustomizationDto {
  @IsInt()
  order_item_id: number;

  @IsOptional()
  @IsUrl({}, { message: 'front_image_url must be a valid URL' })
  front_image_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'back_image_url must be a valid URL' })
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
