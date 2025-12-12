import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsNumber()
  amount: number; // Amount in INR (not paise, we'll convert it in service)
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  razorpay_order_id: string;

  @IsString()
  @IsNotEmpty()
  razorpay_payment_id: string;

  @IsString()
  @IsNotEmpty()
  razorpay_signature: string;
}