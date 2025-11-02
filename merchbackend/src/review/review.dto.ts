import {
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  user_id: number;

  @IsInt()
  product_id: number;

  @IsInt()
  order_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  review_title: string;

  @IsString()
  review_text: string;
}
