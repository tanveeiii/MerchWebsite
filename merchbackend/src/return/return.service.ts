import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnDto } from './return.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReturnService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE RETURN
  async create(dto: CreateReturnDto) {
    const order = await this.prisma.order.findUnique({
      where: { order_id: dto.order_id },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    try {
      const returnRecord = await this.prisma.return.create({
        data: {
          return_number: dto.return_number,
          user_id: dto.user_id,
          order_id: dto.order_id,
          refund_amount: new Decimal(dto.refund_amount),
          reason: dto.reason,
          return_status: dto.return_status,
          requested_at: new Date(),
          completed_at: new Date(),
        },
      });

      return {
        code: 200,
        message: 'Return record created successfully',
        data: returnRecord,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        code: 500,
        message: 'Failed to create return record',
        error: e.message,
      });
    }
  }

  // 2. FIND ALL RETURNS FOR A USER (Fixes your error)
  async findAll(userId: number) {
    try {
      const returns = await this.prisma.return.findMany({
        where: { user_id: userId },
        include: {
          // Include items so the frontend can show what was returned
          ReturnItem: {
            include: {
              order_item: {
                include: {
                  product: true // Get product image/name
                }
              }
            }
          }
        },
        orderBy: {
          requested_at: 'desc'
        }
      });
      return { code: 200, data: returns };
    } catch (e) {
      throw new InternalServerErrorException({ 
        code: 500, 
        message: 'Failed to fetch returns', 
        error: e.message 
      });
    }
  }
}