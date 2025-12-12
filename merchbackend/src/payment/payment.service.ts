import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './payment.dto';

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Replace with env var in production
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key',
    });
  }

  // 1. Create Razorpay Order
  async createOrder(data: CreatePaymentOrderDto) {
    const options = {
      amount: Math.round(data.amount * 100), // Convert to paise (e.g., 500 => 50000)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return {
        code: 200,
        message: 'Order created successfully',
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
      };
    } catch (error) {
      throw new InternalServerErrorException({ 
        code: 500, 
        message: 'Razorpay Order Creation Failed', 
        error: error 
      });
    }
  }

  // 2. Verify Payment Signature
  async verifyPayment(data: VerifyPaymentDto) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'your_secret_key';
    
    // Create HMAC SHA256 signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      
      // OPTIONAL: Save to database here using this.prisma.payment.create(...)
      // For now, we return success so frontend can create the Order
      
      return {
        code: 200,
        message: 'Payment Verified Successfully',
        status: 'success',
        payment_id: razorpay_payment_id
      };
    } else {
      throw new BadRequestException({
        code: 400,
        message: 'Invalid Signature',
        status: 'failed'
      });
    }
  }
}