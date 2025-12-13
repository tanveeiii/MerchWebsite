import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE REVIEW
  async create(data: CreateReviewDto) {
    const { user_id, product_id, order_id, rating, review_title, review_text } = data;
    if(!user_id || !product_id || !order_id || !rating || !review_title || !review_text) 
      throw new BadRequestException({code: 400, message: "Incomplete data provided."});
      
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
      throw new InternalServerErrorException({ code: 500, message: 'Failed to submit review', error: e.message||e });
    }
  }

  // 2. GET REVIEWS BY PRODUCT (Public)
  async findByProduct(productId: number) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: { product_id: productId },
        include: {
          user: { select: { first_name: true, last_name: true } },
          ReviewImage: true 
        },
        orderBy: { created_at: 'desc' }
      });
      return { code: 200, data: reviews };
    } catch (e) {
      throw new InternalServerErrorException({ code: 500, message: 'Error fetching reviews' });
    }
  }

  // 3. ADMIN: GET ALL REVIEWS
  async findAllAdmin() {
    try {
      return await this.prisma.review.findMany({
        include: {
          user: { select: { first_name: true, last_name: true, email: true } },
          
          // --- FIX START ---
          product: { 
            select: { 
              product_name: true, 
              ProductImage: {
                select: { image_url: true },
                take: 1 // Get only the first image
              } 
            } 
          },
          // --- FIX END ---

          ReviewImage: true
        },
        orderBy: { created_at: 'desc' }
      });
    } catch (e) {
      throw new InternalServerErrorException("Failed to fetch admin reviews");
    }
  }

  // 4. ADMIN: DELETE REVIEW
  async delete(reviewId: number) {
    // Check existence
    const existing = await this.prisma.review.findUnique({ where: { review_id: reviewId }});
    if (!existing) throw new NotFoundException("Review not found");

    // Delete (Cascade deletes images if relation is set up correctly in schema, otherwise might need manual image deletion)
    // Note: Ensure your schema has `onDelete: Cascade` for ReviewImage relation, or delete images first here.
    return await this.prisma.review.delete({
      where: { review_id: reviewId }
    });
  }
}