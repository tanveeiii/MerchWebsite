import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateReturnRequestDto {
  @IsString()
  @IsNotEmpty()
  return_name: string;

  @IsInt()
  user_id: number;

  @IsInt()
  order_id: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  return_status: string;

  @IsNumber()
  refund_amount: number;

  @IsDateString()
  requested_at: Date;
}
