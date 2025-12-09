import { Body, Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  // --- NEW Endpoint ---
  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findAll(userId);
  }
}