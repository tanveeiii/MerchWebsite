import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomizationTemplateController } from './template.controller';
import { CustomizationTemplateService } from './template.service';

@Module({
  controllers: [CustomizationTemplateController],
  providers: [CustomizationTemplateService, PrismaService],
})
export class CustomizationTemplateModule {}