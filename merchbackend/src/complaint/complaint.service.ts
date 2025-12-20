import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateComplaintDto, ResolveComplaintDto } from './complaint.dto';

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
    const complaint = await this.prisma.complaint.create({
      data: {
        sender_id: user.user_id,
        sender_type: createComplaintDto.sender_type,
        message: createComplaintDto.message,
        attachment_url: createComplaintDto.attachment_url || '',
        status: 'OPEN', // Default status
        created_at: now,
      },
    });

    return complaint;
  }

  // --- ADMIN: Get All Complaints ---
  async findAll() {
    return await this.prisma.complaint.findMany({
      include:{
        user: { select: { first_name: true, last_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // --- ADMIN: Resolve Complaint (NEW) ---
  async resolve(id: number, dto: ResolveComplaintDto) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { message_id: id }
    });

    if (!complaint) throw new NotFoundException("Complaint ID not found");

    return await this.prisma.complaint.update({
      where: { message_id: id },
      data: {
        admin_reply: dto.admin_reply,
        status: dto.status,
        resolved_at: new Date()
      }
    });
  }
}