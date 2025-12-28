import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  preview_image: string;

  @IsObject()
  @IsNotEmpty()
  data: any;
}