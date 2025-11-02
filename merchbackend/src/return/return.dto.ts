import {
  IsInt,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReturnDto {
  @IsString()
  return_number: string;

  @IsInt()
  user_id: number;

  @IsInt()
  order_id: number;

  @Type(() => Number)
  @IsNumber()
  refund_amount: number;

  @IsString()
  reason: string;

  @IsString()
  return_status: string;
}
