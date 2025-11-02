import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewImageDto } from './review_image.dto';

@Injectable()
export class ReviewImageService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReviewImageDto) {
    // return this.prisma.userNotification.create();
  }
}
