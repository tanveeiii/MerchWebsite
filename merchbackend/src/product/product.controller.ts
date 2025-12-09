import { Body, Controller, Post, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    const product = this.productService.create(dto);
    return product;
  }

  @Get('fetch')
  async fetch(){
    const products = this.productService.fetch();
    return products;
  }
}
