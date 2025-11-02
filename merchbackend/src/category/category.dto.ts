import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string;

  @Type(() => Number)
  @IsInt()
  category_id: number;

  @IsString()
  description: string;

  @IsString()
  image_url: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
