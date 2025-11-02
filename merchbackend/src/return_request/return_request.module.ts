import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReturnRequestController } from './return_request.controller';
import { ReturnRequestService } from './return_request.service';

@Module({
  controllers: [ReturnRequestController],
  providers: [ReturnRequestService, PrismaService],
})
export class ReturnRequestModule {}
