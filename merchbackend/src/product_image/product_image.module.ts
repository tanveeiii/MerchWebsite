import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductImageController } from './product_image.controller';
import { ProductImageService } from './product_image.service';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService, PrismaService],
})
export class ProductImageModule {}
