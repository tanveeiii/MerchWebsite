import { IsInt } from 'class-validator';

export class CreateWishlistDto {
  @IsInt()
  user_id: number;

  @IsInt()
  product_id: number;

  @IsInt()
  product_variant_id: number;
}
