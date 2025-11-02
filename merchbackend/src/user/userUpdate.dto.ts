import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty() @IsString() first_name: string;
  @IsNotEmpty() @IsString() last_name: string;
  @IsEmail() email: string;
  @IsNotEmpty() @IsString() mobile: string;
  @IsDateString() dob: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^(male|female|other)$/i, {
    message: 'gender must be male, female, or other',
  })
  gender: string;
}
