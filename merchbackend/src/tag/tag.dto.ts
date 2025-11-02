import { IsInt, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  tag_name: string;

  @IsInt()
  tag_id: number;
}
