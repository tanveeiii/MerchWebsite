import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE REVIEW
  async create(data: CreateReviewDto) {
    const { user_id, product_id, order_id, rating, review_title, review_text } = data;

    // Check if user actually bought the product (Optional validation)
    // const orderItem = await this.prisma.orderItem.findFirst({ ... })

    try {
      const review = await this.prisma.review.create({
        data: {
          user_id,
          product_id,
          order_id,
          rating,
          review_title,
          review_text,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return { code: 200, message: 'Review submitted', data: review };
    } catch (e) {
      throw new InternalServerErrorException({ code: 500, message: 'Failed to submit review', error: e.message });
    }
  }

  // 2. GET REVIEWS BY PRODUCT (Crucial for frontend)
  async findByProduct(productId: number) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: { product_id: productId },
        include: {
          user: { // Fetch reviewer name
            select: { first_name: true, last_name: true }
          },
          ReviewImage: true // Fetch associated images
        },
        orderBy: { created_at: 'desc' }
      });
      return { code: 200, data: reviews };
    } catch (e) {
      throw new InternalServerErrorException({ code: 500, message: 'Error fetching reviews' });
    }
  }
}