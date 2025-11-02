import { IsInt } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  user_id: number;

  @IsInt()
  product_id: number;

  @IsInt()
  product_variant_id: number;

  @IsInt()
  quantity: number;
}
