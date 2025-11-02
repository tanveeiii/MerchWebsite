import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './order.dto';
import { Decimal } from '@prisma/client/runtime/library';


@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

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
        select: {
          order_number: true,
          shipping_address: true,
          subtotal: true,
          user_id: true,
        },
      });

      return { code: 200, message: 'Order successfully added', order };
    } catch (e: any) {
      throw new InternalServerErrorException({ code: 500, message: 'Failed to create order', details: e?.message });
    }
  }
}
