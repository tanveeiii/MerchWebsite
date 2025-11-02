import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReturnItemDto } from './return_item.dto';

@Injectable()
export class ReturnItemService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReturnItemDto) {
    // return this.prisma.userNotification.create();
  }
}
