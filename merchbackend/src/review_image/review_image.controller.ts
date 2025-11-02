import { Body, Controller, Post } from '@nestjs/common';
import { ReviewImageService } from './review_image.service';
import { CreateReviewImageDto } from './review_image.dto';

@Controller('review_image')
export class ReviewImageController {
  constructor(private readonly reviewImageService: ReviewImageService) {}

  @Post('add')
  async create(@Body() dto: CreateReviewImageDto) {
    return this.reviewImageService.create(dto);
  }
}
