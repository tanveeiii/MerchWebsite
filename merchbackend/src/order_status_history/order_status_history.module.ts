import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderStatusHistoryController } from './order_status_history.controller';
import { OrderStatusHistoryService } from './order_status_history.service';

@Module({
  controllers: [OrderStatusHistoryController],
  providers: [OrderStatusHistoryService, PrismaService],
})
export class OrderStatusHistoryModule {}
