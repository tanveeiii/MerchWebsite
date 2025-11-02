import { IsString } from "class-validator";

export class CreateTagDto{
    @IsString()
    tag_name: string;
}