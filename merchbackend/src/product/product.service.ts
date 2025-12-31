import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto, DeleteProductDto } from './product.dto';
import slugify from 'slugify';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable({})
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // --- 1. CREATE ---
  async create(dto: CreateProductDto) {
    const {
      product_name,
      tag_id,
      description,
      category_ids,
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
      !category_ids ||
      category_ids.length === 0 ||
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
        // --- CHANGED: Connect Multiple Categories ---
        categories: {
          connect: category_ids.map((id) => ({ category_id: Number(id) })),
        },
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
      include: { ProductVariant: true, ProductImage: true, categories: true },
    });

    return { code: 200, message: 'Product created successfully', product };
  }

  // --- 2. FETCH ---
  async fetch() {
    const products = await this.prisma.product.findMany({
      include: {
        ProductImage: { orderBy: { display_order: 'asc' } },
        ProductVariant: true,
        ProductDiscount: { where: { is_active: true } },
        categories: true, // Fetch array of categories
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

  // --- 3. SEARCH ---
  async search(query: string) {
    if (!query || query.trim().length === 0) return [];

    return await this.prisma.product.findMany({
      where: {
        is_active: true,
        OR: [
          { product_name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          // Search inside the list of categories
          {
            categories: {
              some: { category_name: { contains: query, mode: 'insensitive' } },
            },
          },
          { tag: { tag_name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        ProductImage: { where: { is_primary: true }, take: 1 },
        categories: true,
      },
      take: 10,
    });
  }

  // --- 4. SEARCH INDEX ---
  async getSearchIndex() {
    return await this.prisma.product.findMany({
      where: { is_active: true },
      select: {
        product_id: true,
        product_name: true,
        base_price: true,
        categories: { select: { category_name: true } },
        tag: { select: { tag_name: true } },
        ProductImage: {
          where: { is_primary: true },
          take: 1,
          select: { image_url: true },
        },
      },
      orderBy: { view_count: 'desc' },
    });
  }

  async delete(product_id: number) {
    if (!product_id)
      throw new BadRequestException({
        code: 400,
        message: 'Incomplete data provided',
      });

    await this.prisma.$transaction([
      this.prisma.productVariant.deleteMany({
        where: { product_id },
      }),
      this.prisma.product.delete({
        where: { product_id: product_id },
      }),
    ]);
    return { code: 200, message: 'Product deleted successfully' };
  }
}
