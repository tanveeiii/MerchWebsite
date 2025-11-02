import { IsInt, IsOptional } from 'class-validator';

export class CreateReturnItemDto {
  @IsInt()
  return_id: number;

  @IsInt()
  order_item_id: number;

  @IsInt()
  quantity: number;
}
