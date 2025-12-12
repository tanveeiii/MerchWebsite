import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put('update')
  async update(@Body() dto: CreateCategoryDto) {
    return this.categoryService.update(dto);
  }

  // --- NEW Endpoint ---
  @Get('fetch')
  async findAll() {
    return this.categoryService.findAll();
  }
}