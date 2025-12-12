import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateInventoryLogDto } from './inventory_log.dto';

@Injectable()
export class InventoryLogService {
  constructor(private prisma: PrismaService) {}

  // 1. Create Log Entry (Used when stock changes)
  async create(data: CreateInventoryLogDto) {
    const { product_variant_id, action_type, quantity_change, quantity_after } = data;

    // Optional: Validate variant exists
    const variant = await this.prisma.productVariant.findUnique({
      where: { product_variant_id: Number(product_variant_id) }
    });
    if (!variant) throw new BadRequestException("Variant not found");

    const log = await this.prisma.inventoryLog.create({
      data: {
        product_variant_id: Number(product_variant_id),
        action_type,      // e.g., "RESTOCK", "ORDER", "ADJUSTMENT"
        quantity_change: Number(quantity_change),
        quantity_after: Number(quantity_after),
        logged_at: new Date()
      }
    });
    return log;
  }

  // 2. Fetch All Logs (For Admin Dashboard)
  async findAll() {
    return await this.prisma.inventoryLog.findMany({
      include: {
        product_variant: {
          include: {
            product: { select: { product_name: true, sku: true } } // Include Product Name
          }
        }
      },
      orderBy: { logged_at: 'desc' } // Newest first
    });
  }
}