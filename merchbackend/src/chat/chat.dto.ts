import { IsString, IsOptional, IsInt } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  userId?: number; // Optional: To look up specific user orders later if needed
}