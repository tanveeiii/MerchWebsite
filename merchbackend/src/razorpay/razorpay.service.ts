import { Injectable } from "@nestjs/common";
import { instance } from "src/main";
import { PrismaService } from "src/prisma.service";
import crypto from 'crypto'
import { OrderService } from "src/order/order.service";
@Injectable()
export class RazorpayService {
    constructor(private prisma: PrismaService, private orderService: OrderService) { }

    async checkout(data: any) {
        const order = await instance.orders.create({
            amount: data.amount * 100,
            currency: data.currency,
            notes: {
                "merchant_order_id": JSON.stringify(data.product)
            }
        })
        return order;
    }

    async payment_success(data: any) {
        const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY!)
            .update(body)
            .digest('hex');

        if (expectedSignature !== data.razorpay_signature) {
            return {
                success: false,
                url: "http://localhost:3000/checkout/success",
                expectedSignature: expectedSignature
            }
            // throw new Error('Payment verification failed');
        }
        // const order = await this.orderService.create(details)

        return {
            success: true,
            payment_id: data.razorpay_payment_id,
            order_id: data.razorpay_order_id,
            url: "http://localhost:3000/checkout/success"
        };
    }
}

// {
// "razorpay_payment_id": "pay_Rs1YSfqTgPhwLW",
// "razorpay_order_id": "order_Rs1YOFN1DgaNVF",
// "razorpay_signature": "f096c3f7c878066392f0a44f0e7cf6eab8b8fe9b4aee3549c3b07ab20ccc3755"
// }