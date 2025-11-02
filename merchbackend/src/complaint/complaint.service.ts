import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateComplaintDto } from './complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateComplaintDto) {
    // return this.prisma.userNotification.create();
  }
}
