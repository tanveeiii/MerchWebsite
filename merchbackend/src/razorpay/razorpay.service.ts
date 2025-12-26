import { Injectable } from "@nestjs/common";
import { instance } from "src/main";
import { PrismaService } from "src/prisma.service";
import crypto from 'crypto'
import { OrderService } from "src/order/order.service";
import orders from "razorpay/dist/types/orders";
@Injectable()
export class RazorpayService {
    constructor(private prisma: PrismaService, ) { }

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
        console.log("DATA PAYEMTN", data)
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
        // const order = await fetch("http://localhost:5000/api/order/create",{
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //         order_number:
        //         shipping_address: 
        //         subtotal: data.amount
        //         tax_amount: data.aamount
        //         shipping_cost:
        //         discount_amount:
        //         total_amount: data.amount
        //         payment_type: "Razorpay",
        //         order_status: "Delivery Pending",
        //         user_id: data.userId,
        //         razorpay_order_id: data.razorpay_order_id,
        //         razorpay_payment_id: data.razorpay_payment_id
        //     })
        // }
        // )

        return {
            success: true,
            payment_id: data.razorpay_payment_id,
            order_id: data.razorpay_order_id,
            url: "http://localhost:3000/checkout/success"
        };
    }
}
// DATA PAYEMTN {
//   razorpay_payment_id: 'pay_RsPJKebjLQ3CWl',
//   razorpay_order_id: 'order_RsPJ6BBiykdQO8',
//   razorpay_signature: 'c03c3a668a6753b788e0ce7bc577184b45768cb3e41bdcd9d80adfa162165923',
//   userId: '1',
//   items: [
//     {
//       id: 8,
//       name: 'test',
//       price: 100,
//       quantity: 5,
//       product_id: 1,
//       product_variant_id: 1
//     }
//   ],
//   amount: 525,
//   coupon: null
// }

// DATA checkout {
//   amount: 43575,
//   current: 'INR',
//   user: {
//     name: 'Suryansh Nagar',
//     email: 'me230003077@iiti.ac.in',
//     mobile: '9082388554'
//   },
//   product: [
//     {
//       id: 8,
//       name: 'test',
//       price: 100,
//       quantity: 5,
//       product_id: 1,
//       product_variant_id: 1
//     }
//   ]
// }
// ORder:  {
//   amount: 4357500,
//   amount_due: 4357500,
//   amount_paid: 0,
//   attempts: 0,
//   created_at: 1765915227,
//   currency: 'INR',
//   entity: 'order',
//   id: 'order_RsPJ6BBiykdQO8',
//   notes: {
//     merchant_order_id: '[{"id":8,"name":"test","price":100,"quantity":5,"product_id":1,"product_variant_id":1}]'
//   },
//   offer_id: null,
//   receipt: null,
//   status: 'created'
// }
// 