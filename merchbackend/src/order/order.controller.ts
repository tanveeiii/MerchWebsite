import { Body, Controller, Post, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get('admin/all')
  async findAllForAdmin() {
    return this.orderService.findAllForAdmin();
  }

  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findAll(userId);
  }

  @Patch('update/:id')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.orderService.updateStatus(id, status);
  }

  @Patch('cancel/:id')
  async cancelOrder(@Param('id', ParseIntPipe) id: number){
    return this.orderService.cancelOrder(id);
  }
}