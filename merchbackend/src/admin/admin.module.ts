import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
