import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('fetch')
  async fetch(){
    return this.productService.fetch();
  }

  // --- NEW: Search Endpoint ---
  @Get('search')
  async search(@Query('q') q: string) {
    return this.productService.search(q);
  }
}