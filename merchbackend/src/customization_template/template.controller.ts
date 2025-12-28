import { Body, Controller, Get, Post, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CustomizationTemplateService } from './template.service';
import { CreateTemplateDto } from './template.dto';

@Controller('customization-template')
export class CustomizationTemplateController {
  constructor(private readonly templateService: CustomizationTemplateService) {}

  @Post('create')
  async create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Get('fetch')
  async findAll() {
    return this.templateService.findAll();
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.delete(id);
  }
}