import { IsInt, IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';

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

// --- NEW: DTO for Admin Reply ---
export class ResolveComplaintDto {
  @IsString()
  admin_reply: string;

  @IsString()
  status: string; // e.g., 'RESOLVED', 'IN_PROGRESS'
}