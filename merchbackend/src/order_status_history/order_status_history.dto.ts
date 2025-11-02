import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateOrderStatusHistoryDto {
  @IsInt()
  order_id: number;

  @IsString()
  status: string;
}
