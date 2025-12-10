import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './tag.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post('create')
  async create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Put('update')
  async update(@Body() dto: CreateTagDto) {
    return this.tagService.update(dto);
  }

  // --- NEW Endpoint ---
  @Get('fetch')
  async findAll() {
    return this.tagService.findAll();
  }
}