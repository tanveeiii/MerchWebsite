import { Body, Controller, Post, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  // --- ADMIN: Fetch ALL Orders ---
  @Get('admin/all')
  async findAllForAdmin() {
    return this.orderService.findAllForAdmin();
  }

  // // --- USER: Fetch My Orders ---
  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findAll(userId);
  }

  // // --- ADMIN: Update Status ---
  @Patch('update/:id')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.orderService.updateStatus(id, status);
  }
}