import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateInventoryLogDto } from './inventory_log.dto';

@Injectable()
export class InventoryLogService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInventoryLogDto) {
    // return this.prisma.userNotification.create();
  }
}
