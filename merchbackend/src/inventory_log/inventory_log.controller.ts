import { Body, Controller, Post } from '@nestjs/common';
import { InventoryLogService } from './inventory_log.service';
import { CreateInventoryLogDto } from './inventory_log.dto';

@Controller('inventory_log')
export class InventoryLogController {
  constructor(private readonly inventroyLogService: InventoryLogService) {}

  @Post('add')
  async create(@Body() dto: CreateInventoryLogDto) {
    return this.inventroyLogService.create(dto);
  }
}
