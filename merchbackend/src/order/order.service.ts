import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE ORDER (Now handles Cart -> OrderItem + Customization Transfer)
  async create(data: CreateOrderDto) {
    const {
      order_number,
      shipping_address,
      subtotal,
      tax_amount,
      shipping_cost,
      discount_amount,
      total_amount,
      payment_type,
      order_status,
      user_id,
    } = data;

    // Validation
    if (
      !order_number ||
      !shipping_address ||
      subtotal === undefined ||
      tax_amount === undefined ||
      shipping_cost === undefined ||
      discount_amount === undefined ||
      total_amount === undefined ||
      !payment_type ||
      !order_status ||
      !user_id
    )
      throw new BadRequestException({ code: 400, message: 'Incomplete data provided for order' });

    // Decimal Calculations
    const subtotalNum = new Decimal(subtotal);
    const taxNum = new Decimal(tax_amount);
    const shippingCostNum = new Decimal(shipping_cost);
    const discountNum = new Decimal(discount_amount);
    const totalNum = new Decimal(total_amount);

    const computedDecimal = subtotalNum.plus(taxNum).plus(shippingCostNum).minus(discountNum);
    const computedRounded = parseFloat(computedDecimal.toFixed(2));
    const totalRounded = parseFloat(totalNum.toFixed(2));

    if (Math.abs(computedRounded - totalRounded) > 0.01) {
      throw new BadRequestException({
        code: 400,
        message: `Total amount mismatch: computed ${computedRounded} does not match total_amount ${totalRounded}`,
      });
    }

    try {
      // A. Create Order Header
      const order = await this.prisma.order.create({
        data: {
          order_number: order_number,
          shipping_address: Number(shipping_address),
          subtotal: subtotalNum,
          tax_amount: taxNum,
          shipping_cost: shippingCostNum,
          discount_amount: discountNum,
          total_amount: totalNum,
          payment_type: payment_type,
          order_status: order_status,
          user_id: Number(user_id),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // B. Fetch Cart Items to convert to OrderItems
      const cartItems = await this.prisma.cart.findMany({
        where: { user_id: Number(user_id) },
        include: { product: true }
      });

      // C. Loop through Cart Items
      for (const item of cartItems) {
        // 1. Create Order Item
        // Note: Assuming simple calculation for individual item tax/discount as 0 for now 
        // or derived from cart logic.
        const orderItem = await this.prisma.orderItem.create({
          data: {
            order_id: order.order_id,
            product_id: item.product_id,
            // Fallback to 0 if null, assuming schema handles it or variant is required
            product_variant_id: item.product_variant_id || 0, 
            quantity: item.quantity,
            unit_price: item.product.base_price,
            discount_amount: 0, 
            tax_amount: 0, 
            total_price: new Decimal(Number(item.product.base_price) * item.quantity),
            created_at: new Date()
          }
        });

        // 2. TRANSFER CUSTOMIZATION (Critical for Fulfillment View)
        // Check if this cart item had a customization linked
        const customization = await this.prisma.customization.findUnique({
          where: { cart_id: item.cart_id }
        });

        if (customization) {
          // Update customization to point to the new Order Item and remove Cart link
          await this.prisma.customization.update({
            where: { customization_id: customization.customization_id },
            data: { 
              cart_id: null, 
              order_item_id: orderItem.order_item_id 
            }
          });
        }
      }

      // D. Clear User Cart
      await this.prisma.cart.deleteMany({
        where: { user_id: Number(user_id) }
      });

      return { code: 200, message: 'Order successfully added', order };
    } catch (e: any) {
      throw new InternalServerErrorException({ code: 500, message: 'Failed to create order', error: e?.message });
    }
  }

  // --- USER: Get Specific User Orders ---
  async findAll(userId: number) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { user_id: userId },
        include: {
          OrderItem: { 
            include: {
              product: true,
              // Include customization for User History too
              Customization: true 
            }
          }
        },
        orderBy: {
          created_at: 'desc' 
        }
      });
      return { code: 200, data: orders };
    } catch (e) {
      throw new InternalServerErrorException({ code: 500, message: 'Failed to fetch orders', error: e.message });
    }
  }

  // --- ADMIN: Get Single Order (For Details Page) ---
  // This was missing but is required for the Customization Viewer
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { order_id: id },
      include: {
        user: true,
        s_address: true,
        OrderItem: {
          include: {
            product: true,
            product_variant: true,
            Customization: true, // <--- Fetches the design/text
          }
        }
      }
    });

    if (!order) throw new NotFoundException('Order not found');
    return { code: 200, order };
  }

  // --- ADMIN: Get ALL Orders ---
  async findAllForAdmin() {
    return await this.prisma.order.findMany({
      include: {
        OrderItem: { include: { product: true } },
        user: { select: { first_name: true, last_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // --- ADMIN: Update Order Status ---
  async updateStatus(orderId: number, status: string) {
    return await this.prisma.order.update({
      where: { order_id: orderId },
      data: { order_status: status }
    });
  }
}