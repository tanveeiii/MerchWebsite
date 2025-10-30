import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  identity: string; 

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;
}
