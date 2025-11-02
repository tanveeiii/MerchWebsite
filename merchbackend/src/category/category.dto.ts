import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string;

  @IsString()
  description: string;

  @IsString()
  image_url: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
