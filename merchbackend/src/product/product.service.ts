import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './product.dto';
import slugify from 'slugify';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable({})
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // ... (Keep existing create and fetch methods as they are) ...

  async create(dto: CreateProductDto) {
    const {
      product_name,
      tag_id,
      description,
      category_id,
      base_price,
      sku,
      is_active,
      variants,
      images,
    } = dto;

    if (
      !product_name ||
      !tag_id ||
      !description ||
      !category_id ||
      base_price === undefined ||
      !sku
    )
      throw new BadRequestException({
        code: 400,
        message: 'Incomplete data provided',
      });

    const slug = slugify(product_name, { lower: true, strict: true });

    const variantData = variants?.map((v) => ({
      size: v.size,
      color: v.color,
      material: v.material,
      sku: v.sku,
      price: new Decimal(v.price),
      stock_quantity: Number(v.stock_quantity),
      low_stock_threshold: Number(v.low_stock_threshold),
      weight: new Decimal(v.weight),
      is_available: v.is_available ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const imageData = images?.map((img) => ({
      image_url: img.image_url,
      alt_text: img.alt_text || product_name,
      display_order: Number(img.display_order),
      is_primary: Boolean(img.is_primary),
      uploaded_at: new Date(),
    }));

    const product = await this.prisma.product.create({
      data: {
        product_name,
        slug,
        tag_id: Number(tag_id),
        description,
        category_id: Number(category_id),
        base_price: new Decimal(base_price),
        sku,
        is_active: Boolean(is_active),
        view_count: 0,
        average_rating: new Decimal(0),
        total_reviews: 0,
        created_at: new Date(),
        updated_at: new Date(),
        ProductVariant: variantData ? { create: variantData } : undefined,
        ProductImage: imageData ? { create: imageData } : undefined,
      },
      include: { ProductVariant: true, ProductImage: true },
    });

    return { code: 200, message: 'Product created successfully', product };
  }

  async fetch() {
    const products = await this.prisma.product.findMany({
      include: {
        ProductImage: { orderBy: { display_order: 'asc' } },
        ProductVariant: true,
        ProductDiscount: { where: { is_active: true } },
        category: true,
        tag: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return {
      code: 200,
      message: 'Products fetched successfully',
      data: products,
    };
  }

  // --- NEW: Optimized Search Index (Lightweight) ---
  async getSearchIndex() {
    const products = await this.prisma.product.findMany({
      where: { is_active: true },
      select: {
        product_id: true,
        product_name: true,
        base_price: true,
        category: { select: { category_name: true } },
        tag: { select: { tag_name: true } },
        ProductImage: {
          where: { is_primary: true },
          take: 1,
          select: { image_url: true },
        },
      },
      orderBy: { view_count: 'desc' }, // Show popular items first
    });
    return products;
  }
}
