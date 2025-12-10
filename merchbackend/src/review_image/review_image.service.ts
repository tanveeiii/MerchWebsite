import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewImageDto } from './review_image.dto';

@Injectable()
export class ReviewImageService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReviewImageDto) {
    const review = await this.prisma.review.findUnique({
        where: { review_id: data.review_id }
    });

    if(!review) throw new BadRequestException("Review does not exist");

    return await this.prisma.reviewImage.create({
        data: {
            review_id: data.review_id,
            image_url: data.image_url,
            updated_at: new Date()
        }
    });
  }
}