import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateComplaintDto } from './complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async create(createComplaintDto: CreateComplaintDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: createComplaintDto.sender_id },
    });
    if (!user)
      throw new BadRequestException({
        code: 400,
        message: 'User does not exist',
      });
    const now = new Date();
    const cart = await this.prisma.complaint.create({
      data: {
        sender_id: user.user_id,
        sender_type: createComplaintDto.sender_type,
        message: createComplaintDto.message,
        attachment_url: createComplaintDto.attachment_url || '',
        created_at: now,
      },
      select: {
        sender_id: true,
        sender_type: true,
        message: true,
        attachment_url: true,
      },
    });

    return cart;
  }

  // --- ADMIN: Get All Complaints (New) ---
  async findAll() {
    return await this.prisma.complaint.findMany({
      include:{
        user: { select: { first_name: true, last_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }
}