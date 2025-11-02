import { Controller } from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./tag.dto";

@Controller('tag')
export class TagController{
    constructor(private tagService: TagService) {}
    async add(dto:CreateTagDto){
        const tag = this.tagService.add(dto);
        return tag;
    }
}