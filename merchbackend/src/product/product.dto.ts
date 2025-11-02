import { IsString, IsInt, IsBoolean, IsOptional, IsNumber} from 'class-validator';

export class CreateProductDto {
  @IsString()
  product_name: string;

  @IsInt()
  tag_id: number;

  @IsString()
  description: string;

  @IsInt()
  category_id: number;
 
  @IsNumber({ maxDecimalPlaces: 2 })
  base_price: number;

  @IsString()
  sku: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

}
