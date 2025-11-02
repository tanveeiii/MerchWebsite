import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateAnalyticsDto {
  @IsString()
  email: string;

  @IsInt()
  product_id: number;

  @IsString()
  event_type: string;

  @IsString()
  page_url: string;

  @IsString()
  ip_address: string;

  @IsOptional()
  @IsString()
  event_data?: string;
}
