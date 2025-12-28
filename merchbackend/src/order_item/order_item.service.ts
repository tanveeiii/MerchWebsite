import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateOrderItemDto } from "./order_item.dto";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderItemDto) {
    const {
      order_id,
      product_id,
      product_variant_id,
      quantity,
      tax_amount,
      discount_amount,
    } = dto;

    const product_details = await this.prisma.productVariant.findFirst({
      where: { product_variant_id },
    });

    if (!product_details) {
      throw new BadRequestException("Product variant not found");
    }

    const unit_price = product_details.price;
    const total_price = new Decimal(unit_price).mul(quantity);

    const orderItemData: any = {
      order_id,
      product_id,
      product_variant_id,
      quantity,
      unit_price,
      total_price,
    };

    if (tax_amount !== undefined) {
      orderItemData.tax_amount = tax_amount;
    }

    if (discount_amount !== undefined) {
      orderItemData.discount_amount = discount_amount;
    }

    const order_item = await this.prisma.orderItem.create({
      data: orderItemData,
    });

    return {
      code: 200,
      message: "Order item created successfully",
      order_item,
    };
  }
}
