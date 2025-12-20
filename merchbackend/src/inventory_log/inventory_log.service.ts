import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateInventoryLogDto } from './inventory_log.dto';

@Injectable()
export class InventoryLogService {
  constructor(private prisma: PrismaService) {}

  // 1. Create Log Entry (Passive - Just records history)
  async create(data: CreateInventoryLogDto) {
    return await this.prisma.inventoryLog.create({
      data: {
        product_variant_id: Number(data.product_variant_id),
        action_type: data.action_type,
        quantity_change: Number(data.quantity_change),
        quantity_after: Number(data.quantity_after),
        logged_at: new Date()
      }
    });
  }

  // 2. Adjust Stock (Active - Updates Stock AND Creates Log)
  async adjustStock(data: CreateInventoryLogDto) {
    const { product_variant_id, action_type, quantity_change } = data;
    const variantId = Number(product_variant_id);
    const change = Number(quantity_change);

    // Run in transaction to ensure data integrity
    return await this.prisma.$transaction(async (tx) => {
      // A. Get Current Stock
      const variant = await tx.productVariant.findUnique({
        where: { product_variant_id: variantId }
      });

      if (!variant) throw new BadRequestException("Variant not found");

      // B. Calculate New Stock
      const newStock = variant.stock_quantity + change;
      if (newStock < 0) throw new BadRequestException("Insufficient stock for this operation");

      // C. Update Variant Stock
      await tx.productVariant.update({
        where: { product_variant_id: variantId },
        data: { stock_quantity: newStock }
      });

      // D. Create Log Entry
      const log = await tx.inventoryLog.create({
        data: {
          product_variant_id: variantId,
          action_type: action_type,
          quantity_change: change,
          quantity_after: newStock, // Record the stock AFTER the change
          logged_at: new Date()
        },
        include: {
            product_variant: {
                include: { product: true }
            }
        }
      });

      return log;
    });
  }

  // 3. Fetch All Logs
  async findAll() {
    return await this.prisma.inventoryLog.findMany({
      include: {
        product_variant: {
          include: {
            product: { select: { product_name: true, sku: true } }
          }
        }
      },
      orderBy: { logged_at: 'desc' }
    });
  }
}