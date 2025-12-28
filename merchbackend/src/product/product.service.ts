import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './product.dto';
import slugify from 'slugify';
import { Decimal } from '@prisma/client/runtime/library';

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
      variants, // Extract variants
      images, // Extract images
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

    // Prepare Nested Writes for Variants
    const variantData = variants?.map((v) => ({
      size: v.size,
      color: v.color,
      material: v.material,
      sku: v.sku,
      price: new Decimal(v.price), // Fix Decimal
      stock_quantity: Number(v.stock_quantity),
      low_stock_threshold: Number(v.low_stock_threshold),
      weight: new Decimal(v.weight), // Fix Decimal
      is_available: v.is_available ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Prepare Nested Writes for Images
    const imageData = images?.map((img) => ({
      image_url: img.image_url,
      alt_text: img.alt_text || product_name,
      display_order: Number(img.display_order),
      is_primary: Boolean(img.is_primary),
      uploaded_at: new Date(),
    }));

    const product = await this.prisma.product.create({
      data: {
        product_name: product_name,
        slug: slug,
        tag_id: Number(tag_id),
        description: description,
        category_id: Number(category_id),
        base_price: new Decimal(base_price), // Fix Decimal
        sku: sku,
        is_active: Boolean(is_active),
        view_count: 0,
        average_rating: new Decimal(0),
        total_reviews: 0,
        created_at: new Date(),
        updated_at: new Date(),
        
        // --- Transactional Creation ---
        ProductVariant: variantData ? { create: variantData } : undefined,
        ProductImage: imageData ? { create: imageData } : undefined,
      },
      include: {
        ProductVariant: true,
        ProductImage: true,
      },
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
      orderBy: { created_at: 'desc' }
    });
    return {code: 200, 
      message: 'Products fetched successfully',
      data: products
    };
  }
}