import { Body, Controller, Post } from '@nestjs/common';
import { OrderStatusHistoryService } from './order_status_history.service';
import { CreateOrderStatusHistoryDto } from './order_status_history.dto';

@Controller('order_status_history')
export class OrderStatusHistoryController {
  constructor(private readonly orderStatusHistoryService: OrderStatusHistoryService) {}

  @Post('add')
  async create(@Body() dto: CreateOrderStatusHistoryDto) {
    return this.orderStatusHistoryService.create(dto);
  }
}
