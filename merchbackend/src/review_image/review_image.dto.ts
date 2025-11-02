import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateReviewImageDto {
  @IsInt()
  review_id: number;

  @IsString()
  image_url: string;
}
