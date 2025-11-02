import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderItemController } from './order_item.controller';
import { OrderItemService } from './order_item.service';

@Module({
  controllers: [OrderItemController],
  providers: [OrderItemService, PrismaService],
})
export class OrderItemModule {}
