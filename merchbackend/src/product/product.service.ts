import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './product.dto';
import slugify from 'slugify';

@Injectable({})
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateProductDto) {
    const {
      product_name,
      tag_id,
      description,
      category_id,
      base_price,
      sku,
      is_active,
    } = dto;
    if (
      !product_name ||
      !tag_id ||
      !description ||
      !category_id ||
      !base_price ||
      !sku ||
      !is_active
    )
      throw new BadRequestException({
        code: 400,
        message: 'Incomplete data provided',
      });

    const slug = slugify(product_name, { lower: true, strict: true });
    const product = await this.prisma.product.create({
      data: {
        product_name: product_name,
        slug: slug,
        tag_id: Number(tag_id),
        description: description,
        category_id: Number(category_id),
        base_price: base_price,
        sku: sku,
        is_active: Boolean(is_active),
        view_count: 0,
        average_rating: 0,
        total_reviews: 0,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
      select: {
        product_id: true,
        product_name: true,
        slug: true,
        tag_id: true,
        description: true,
        category_id: true,
        base_price: true,
        sku: true,
        is_active: true,
        view_count: true,
        average_rating: true,
        total_reviews: true,
      },
    });

    return { code: '200', message: 'Product added successfully', product };
  }

 async fetch() {
    const products = await this.prisma.product.findMany({
      include: {
        ProductImage: true,
        ProductVariant: true,
        ProductDiscount: { where: { is_active: true } },
        category: true, // Includes Category Name
        tag: true       // <--- ADD THIS: Include Tag Name
      }
    });
    return { code: '200', message: 'Products fetched successfully', data: products };
  }
}