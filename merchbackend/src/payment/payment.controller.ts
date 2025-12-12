import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(@Body() dto: CreatePaymentOrderDto) {
    return this.paymentService.createOrder(dto);
  }

  @Post('verify')
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(dto);
  }
}