import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventoryLogService } from './inventory_log.service';
import { CreateInventoryLogDto } from './inventory_log.dto';

@Controller('inventory_log')
export class InventoryLogController {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  // Standard Create (Internal use)
  @Post('create')
  async create(@Body() dto: CreateInventoryLogDto) {
    return this.inventoryLogService.create(dto);
  }

  // --- NEW: Manual Stock Adjustment Endpoint ---
  @Post('adjust')
  async adjustStock(@Body() dto: CreateInventoryLogDto) {
    return this.inventoryLogService.adjustStock(dto);
  }

  // Admin List
  @Get('admin/all')
  async findAll() {
    return this.inventoryLogService.findAll();
  }
}