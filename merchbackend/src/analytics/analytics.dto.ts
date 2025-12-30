import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateAnalyticsDto {
  @IsInt()
  user_id: number;

  @IsInt()
  product_id: number;
}
