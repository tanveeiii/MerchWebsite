import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomizationController } from './customization.controller';
import { CustomizationService } from './customization.service';

@Module({
  controllers: [CustomizationController],
  providers: [CustomizationService, PrismaService],
})
export class CustomizationModule {}
