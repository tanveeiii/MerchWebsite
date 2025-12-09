import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnItemDto } from './return_item.dto';

@Injectable()
export class ReturnItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReturnItemDto) {
    // Validate Return ID exists
    const returnRecord = await this.prisma.return.findUnique({
      where: { return_id: dto.return_id },
    });
    if (!returnRecord) throw new BadRequestException('Invalid Return ID');

    // Validate Order Item exists
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { order_item_id: dto.order_item_id },
    });
    if (!orderItem) throw new BadRequestException('Invalid Order Item ID');

    try {
      const returnItem = await this.prisma.returnItem.create({
        data: {
          return_id: dto.return_id,
          order_item_id: dto.order_item_id,
          quantity: dto.quantity,
          created_at: new Date(),
        },
      });

      return {
        code: 200,
        message: 'Return Item added successfully',
        data: returnItem,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        code: 500,
        message: 'Failed to add return item',
        error: e.message,
      });
    }
  }
}