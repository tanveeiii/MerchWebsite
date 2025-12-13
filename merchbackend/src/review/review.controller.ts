import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // Public: Get product reviews
  @Get('product/:productId')
  async findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findByProduct(productId);
  }

  // --- NEW ADMIN ENDPOINTS ---

  @Get('admin/all')
  async findAllAdmin() {
    return this.reviewService.findAllAdmin();
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.delete(id);
  }
}