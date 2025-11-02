import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateUserNotificationDto {
  @IsInt()
  user_id: number;

  @IsString()
  notification_type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  link_url: string;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean = false;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsDateString()
  updated_at?: string;
}
