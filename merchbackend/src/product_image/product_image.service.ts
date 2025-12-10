import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductImageDto } from './product_image.dto';

@Injectable()
export class ProductImageService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductImageDto) {
    const { product_id, image_url, alt_text, display_order, is_primary } = data;

    // 1. Check if Product exists
    const product = await this.prisma.product.findUnique({
      where: { product_id: Number(product_id) },
    });

    if (!product) {
      throw new NotFoundException({ code: 404, message: 'Product not found' });
    }

    if (!image_url || display_order === undefined) {
      throw new BadRequestException({ code: 400, message: 'Image URL and display order are required' });
    }

    // 2. Create the Image Record
    const image = await this.prisma.productImage.create({
      data: {
        product_id: Number(product_id),
        image_url,
        alt_text: alt_text || 'Product Image',
        display_order: Number(display_order),
        is_primary: Boolean(is_primary),
        uploaded_at: new Date(),
      },
    });

    return {
      code: 200,
      message: 'Product Image added successfully',
      data: image,
    };
  }
}