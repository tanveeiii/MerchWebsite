import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateOrderDto } from "./order.dto";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateOrderDto) {
    const { order_number, shipping_address, subtotal, tax_amount, shipping_cost, discount_amount, total_amount, payment_type, order_status, razorpay_order_id, razorpay_payment_id, user_id } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const cart_items = await tx.cart.findMany({
        where: { user_id },
      });

      if (!cart_items.length) {
        throw new BadRequestException("Cart not found");
      }

      const orderData: any = {
        order_number,
        shipping_address,
        subtotal,
        discount_amount,
        total_amount,
        payment_type,
        order_status,
        user_id,
      };

      if (tax_amount !== undefined) orderData.tax_amount = tax_amount;
      if (shipping_cost !== undefined) orderData.shipping_cost = shipping_cost;

      if (payment_type?.toLowerCase() === "online") {
        orderData.razorpay_order_id = razorpay_order_id;
        orderData.razorpay_payment_id = razorpay_payment_id;
      }

      const order = await tx.order.create({
        data: orderData,
        select: { order_id: true },
      });

      for (const item of cart_items) {
        if (order_status === "FORCE_FAIL") throw new BadRequestException("Forced failure after cart fetch");
        if (!item.product_variant_id) {
          throw new BadRequestException(
            `Cart item ${item.cart_id} has no product variant`
          );
        }

        const variant = await tx.productVariant.findFirst({
          where: { product_variant_id: item.product_variant_id },
        });

        if (!variant) {
          throw new BadRequestException(
            `Product variant not found: ${item.product_variant_id}`
          );
        }
        const data_input = {
          order_id: order.order_id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          unit_price: variant.price,
          total_price: variant.price.mul(item.quantity),
          tax_amount,
          discount_amount,
          created_at: new Date(),
        };

        await tx.orderItem.create({
          data: data_input,
        });

      }
      await tx.cart.deleteMany({
        where: { user_id },
      });

      return {
        code: 201,
        message: "Order created successfully",
        order_id: order.order_id,
      };
    });
  }

  async findAll(userId: number) {
    if (!userId) {
      throw new BadRequestException("User id is required");
    }

    const orders = await this.prisma.order.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      }
    });

    return {
      code: 200,
      message: "Orders fetched successfully",
      data: orders,
    };
  }
  async findAllForAdmin(){
    const orders = await this.prisma.order.findMany({orderBy:{
      created_at: "desc",
    }})
    return {
      code: 200,
      message: "Orders fetched successfully",
      data: orders,
    };
  }
}
