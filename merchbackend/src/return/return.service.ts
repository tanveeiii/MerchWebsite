import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnDto } from './return.dto';

@Injectable()
export class ReturnService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReturnDto) {
    // return this.prisma.userNotification.create();
  }
}
