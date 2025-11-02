import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderStatusHistoryDto } from './order_status_history.dto';

@Injectable()
export class OrderStatusHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderStatusHistoryDto) {
    // return this.prisma.userNotification.create();
  }
}
