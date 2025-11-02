import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class AddAddressDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  address_type: string;

  @IsString()
  street_address: string;

  @IsString()
  apartment_suite: string;

  @IsString()
  city: string;

  @IsString()
  state_province: string;

  @IsString()
  postal_code: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean = true;
}
