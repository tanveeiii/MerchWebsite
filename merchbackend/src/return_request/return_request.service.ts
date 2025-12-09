import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnRequestDto } from './return_request.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReturnRequestService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReturnRequestDto) {
    const { return_name, user_id, order_id, reason, return_status, refund_amount, requested_at } = dto;

    // Validate User and Order
    const user = await this.prisma.user.findUnique({ where: { user_id } });
    if (!user) throw new BadRequestException('User not found');

    const order = await this.prisma.order.findUnique({ where: { order_id } });
    if (!order) throw new BadRequestException('Order not found');

    try {
      const request = await this.prisma.returnRequest.create({
        data: {
          return_name,
          user_id,
          order_id,
          reason,
          return_status,
          refund_amount: new Decimal(refund_amount),
          requested_at: new Date(requested_at),
          approved_at: new Date(), // Placeholder: usually null until admin approves
          completed_at: new Date(), // Placeholder
        },
      });

      return {
        code: 200,
        message: 'Return request submitted successfully',
        data: request,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        code: 500,
        message: 'Failed to submit return request',
        error: e.message,
      });
    }
  }
}