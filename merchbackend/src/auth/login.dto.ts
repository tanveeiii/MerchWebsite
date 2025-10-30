import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email: string; 

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;
}
