import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderItemDto } from './order_item.dto';
import { error } from 'console';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderItemDto) {
    const{order_id, product_id, product_variant_id, quantity, unit_price, discount_amount, tax_amount, total_price} = data;

    if(!order_id || !product_id || !product_variant_id || !quantity || !unit_price || !discount_amount || !tax_amount || !total_price)
      throw new BadRequestException({code: 400, message: "incomplete data provided"})

    const unit_priceNum = Decimal(unit_price)
    const discount_amountNum = Decimal(discount_amount)
    const tax_amountNum = Decimal(tax_amount)
    const total_priceNum = Decimal(total_price)
    const quantityNum = Number(quantity)
  
    try{
    const order_item = await this.prisma.orderItem.create({
      data: {
        order_id: Number(order_id),
        product_id: Number(product_id),
        product_variant_id: Number(product_variant_id),
        quantity: quantityNum,
        unit_price: unit_priceNum,
        discount_amount: discount_amountNum,
        tax_amount: tax_amountNum, 
        total_price: total_priceNum,
        created_at: new Date(Date.now())
      },
      select: {
        order_id: true,
        product_id: true,
        product_variant_id: true,
        quantity: true,
        total_price: true
      }
    })
    return {code: 200, message: "order iteam added successfully", order_item}
  }catch(e){
    throw new InternalServerErrorException({code: 200, message: "Failed to create order item", error: e?.message})
  }
  }
}
