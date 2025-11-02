import { IsInt, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  order_id: number;

  @IsString()
  payment_method: string;

  @IsString()
  transaction_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  payment_status: string;

  @IsString()
  payment_details: string;

  @IsDateString()
  payment_date: string;
}
