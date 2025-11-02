import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InventoryLogController } from './inventory_log.controller';
import { InventoryLogService } from './inventory_log.service';

@Module({
  controllers: [InventoryLogController],
  providers: [InventoryLogService, PrismaService],
})
export class InventoryLogModule {}
