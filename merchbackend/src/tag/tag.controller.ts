import { Body, Controller, Post, Put } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './tag.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}
  @Post('add')
  async add(@Body() dto: CreateTagDto) {
    const tag = this.tagService.add(dto);
    return tag;
  }

  @Put('update')
  async update(@Body() dto: CreateTagDto) {
    const tag = this.tagService.update(dto);
    return tag;
  }
}
