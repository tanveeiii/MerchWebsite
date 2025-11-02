import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnRequestDto } from './return_request.dto';

@Injectable()
export class ReturnRequestService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReturnRequestDto) {
    // return this.prisma.userNotification.create();
  }
}
