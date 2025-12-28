import { Injectable } from "@nestjs/common";
import { instance } from "src/main";
import { PrismaService } from "src/prisma.service";
import crypto from "crypto";

@Injectable()
export class RazorpayService {
  constructor(private prisma: PrismaService) {}

  async checkout(data: any) {
    const order = await instance.orders.create({
      amount: data.amount * 100,
      currency: data.currency,
      notes: {
        merchant_order_id: JSON.stringify(data.product),
      },
    });
    return order;
  }

  async payment_success(data: any) {
    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    console.log("DATA PAYMENT", data);
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      return {
        success: false,
        url: "http://localhost:3000/checkout/success",
        expectedSignature,
      };
    }

    try {
      // normalize user id (frontend sends userId; older callers might send user_id)
      const userId = data.userId ?? data.user_id;

      const createOrderRes = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: "11001",
          user_id: Number(userId),
          shipping_address: 1, // keep as you had it; ensure this address_id exists
          subtotal: data.subtotal,
          tax_amount: 0,
          shipping_cost: 0,
          discount_amount: data.coupon,
          total_amount: data.amount,
          payment_type: "online",
          order_status: "Delivery Pending",
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
        }),
      });

      // parse response body (important — a Response object is not the JSON)
      const createOrderJson = await createOrderRes.json().catch(() => null);
      console.log("createOrder response:", createOrderJson);
    } catch (e) {
      console.log("An error occurred with the code: ", e);
    }

    return {
      success: true,
      payment_id: data.razorpay_payment_id,
      order_id: data.razorpay_order_id,
      url: "http://localhost:3000/checkout/success",
    };
  }
}
