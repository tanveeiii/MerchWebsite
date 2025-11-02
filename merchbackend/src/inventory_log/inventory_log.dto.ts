import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateInventoryLogDto {
  @IsInt()
  product_variant_id: number;

  @IsString()
  action_type: string;

  @IsInt()
  quantity_change: number;

  @IsInt()
  quantity_after: number;
}
