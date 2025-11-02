import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  access_token?: string;
}
