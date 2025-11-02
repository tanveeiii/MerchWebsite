import { IsInt, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateComplaintDto {
  @IsInt()
  sender_id: number;

  @IsString()
  sender_type: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsUrl()
  attachment_url?: string;
}
