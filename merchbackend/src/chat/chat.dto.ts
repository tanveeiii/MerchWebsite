import { IsString, IsOptional, IsInt } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  userId?: number; // <--- This allows the User Context
}