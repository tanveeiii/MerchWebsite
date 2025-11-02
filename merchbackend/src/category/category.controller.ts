import { Body, Controller, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post('create')
  async create(@Body() dto: CreateCategoryDto) {
    const category = this.categoryService.create(dto);
    return category;
  }

  @Put('update')
  async update(@Body() dto: CreateCategoryDto) {
    const category = this.categoryService.update(dto);
    return category;
  }
}
