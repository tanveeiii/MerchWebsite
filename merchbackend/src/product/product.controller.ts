import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, DeleteProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('fetch')
  async fetch() {
    return this.productService.fetch();
  }

  // Used by the "Fast" Search Bar
  @Get('search-index')
  async getSearchIndex() {
    return this.productService.getSearchIndex();
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.productService.search(q);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) product_id: number) {
    return this.productService.delete(product_id);
  }
}
