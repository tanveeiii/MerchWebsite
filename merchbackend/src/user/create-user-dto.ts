import { IsEmail, IsNotEmpty, IsString, IsDateString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() @IsString() first_name: string;
  @IsNotEmpty() @IsString() last_name: string;
  @IsEmail() email: string;
  @IsNotEmpty() @IsString() mobile: string;
  @IsDateString() dob: string; 
  @IsNotEmpty() @IsString()
  @Length(6, 128)
  password: string;
  @IsNotEmpty() @IsString()
  @Matches(/^(male|female|other)$/i, { message: 'gender must be male, female, or other' })
  gender: string;
}