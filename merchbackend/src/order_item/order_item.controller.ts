import { Body, Controller, Post } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { CreateOrderItemDto } from './order_item.dto';

@Controller('order_item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post('create')
  async create(@Body() dto: CreateOrderItemDto) {
    return this.orderItemService.create(dto);
  }
}
