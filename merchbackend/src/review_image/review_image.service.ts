import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewImageDto } from './review_image.dto';

@Injectable()
export class ReviewImageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewImageDto) {
    const {review_id, image_url} = dto;
    if(!review_id || !image_url) throw new BadRequestException({code: 400, message: "Data not complete. Please send all the data"})
    
    try{
      const entry = await this.prisma.reviewImage.create({
        data: {
          review_id: review_id,
          image_url: image_url,
          updated_at: new Date()
        },
      })
      return {code: 200, message: "Review image submitted successfully", entry}
    }catch(e){
      throw new InternalServerErrorException({code: 500, message: "There was an error while submitting the review image kindly upload again", error_messages: e||e.message})
    }
  }
}
