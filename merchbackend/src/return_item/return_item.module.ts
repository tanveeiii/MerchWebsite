import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReturnItemController } from './return_item.controller';
import { ReturnItemService } from './return_item.service';

@Module({
  controllers: [ReturnItemController],
  providers: [ReturnItemService, PrismaService],
})
export class ReturnItemModule {}
