// merchbackend/src/cart/cart.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

// Keep existing CreateCartDto...
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

// Add this NEW Update DTO
export class UpdateCartDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}