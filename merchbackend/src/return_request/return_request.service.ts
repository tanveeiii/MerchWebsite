import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnRequestDto } from './return_request.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReturnRequestService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE REQUEST (User)
  async create(dto: CreateReturnRequestDto) {
    const { return_name, user_id, order_id, reason, refund_amount } = dto;

    const user = await this.prisma.user.findUnique({ where: { user_id } });
    if (!user) throw new BadRequestException('User not found');

    const order = await this.prisma.order.findUnique({ where: { order_id } });
    if (!order) throw new BadRequestException('Order not found');

    // Check if request already exists
    const existing = await this.prisma.returnRequest.findFirst({
        where: { order_id: order_id }
    });
    if(existing) throw new BadRequestException('Return request already exists for this order');

    const finalName = return_name || `REQ-${order.order_number}`;

    try {
      const request = await this.prisma.returnRequest.create({
        data: {
          return_name: finalName,
          user_id,
          order_id,
          reason,
          return_status: 'PENDING',
          refund_amount: new Decimal(refund_amount),
          requested_at: new Date(),
          approved_at: new Date(0), // Placeholder
          completed_at: new Date(0),
        },
      });

      return {
        code: 200,
        message: 'Return request submitted. Awaiting Admin Approval.',
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

  // 2. FETCH PENDING REQUESTS (Admin)
  async findAllPending() {
    return await this.prisma.returnRequest.findMany({
      where: { return_status: 'PENDING' },
      include: {
        user: { select: { first_name: true, email: true } },
        order: true
      },
      orderBy: { requested_at: 'desc' }
    });
  }

  // 3. APPROVE REQUEST (Admin Logic)
  async approveRequest(requestId: number) {
    const request = await this.prisma.returnRequest.findUnique({
      where: { return_request_id: requestId },
    });

    if (!request) throw new NotFoundException('Request not found');
    if (request.return_status !== 'PENDING') throw new BadRequestException('Request already processed');

    // TRANSACTION: 1. Update Request -> 2. Create Return -> 3. Update Order Status
    return await this.prisma.$transaction(async (tx) => {
      // A. Mark Request as Approved
      await tx.returnRequest.update({
        where: { return_request_id: requestId },
        data: {
          return_status: 'APPROVED',
          approved_at: new Date(),
        },
      });

      // B. Create Official Return Record
      const newReturn = await tx.return.create({
        data: {
          return_number: `RET-${request.return_name}`,
          user_id: request.user_id,
          order_id: request.order_id,
          refund_amount: request.refund_amount,
          reason: request.reason,
          return_status: 'APPROVED',
          requested_at: request.requested_at,
          completed_at: new Date(),
        },
      });

      // C. Update Order Status
      await tx.order.update({
        where: { order_id: request.order_id },
        data: { order_status: 'RETURNED' }
      });

      return { code: 200, message: 'Return Approved & Processed', data: newReturn };
    });
  }

  // 4. REJECT REQUEST (Admin)
  async rejectRequest(requestId: number) {
    return await this.prisma.returnRequest.update({
        where: { return_request_id: requestId },
        data: { 
            return_status: 'REJECTED',
            completed_at: new Date()
        }
    });
  }
}