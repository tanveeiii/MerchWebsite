import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // --- NEW Endpoint to get reviews for a product ---
  @Get('product/:productId')
  async findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findByProduct(productId);
  }
}