import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderItemDto } from './order_item.dto';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderItemDto) {
    // return this.prisma.userNotification.create();
  }
}
