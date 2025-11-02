import { Body, Controller, Post } from '@nestjs/common';
import { ProductImageService } from './product_image.service';
import { CreateProductImageDto } from './product_image.dto';

@Controller('product_image')
export class ProductImageController {
  constructor(private readonly prodcutImageService: ProductImageService) {}

  @Post('add')
  async create(@Body() dto: CreateProductImageDto) {
    return this.prodcutImageService.create(dto);
  }
}
