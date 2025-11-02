import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewImageController } from './review_image.controller';
import { ReviewImageService } from './review_image.service';

@Module({
  controllers: [ReviewImageController],
  providers: [ReviewImageService, PrismaService],
})
export class ReviewImageModule {}
