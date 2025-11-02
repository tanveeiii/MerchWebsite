import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';

@Module({
  controllers: [ReturnController],
  providers: [ReturnService, PrismaService],
})
export class ReturnModule {}
