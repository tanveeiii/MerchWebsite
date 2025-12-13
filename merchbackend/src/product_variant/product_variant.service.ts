import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductVariantDto } from './product_variant.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable({})
export class ProductVariantService {
  constructor(private prisma: PrismaService) {}
  
  async create(dto: CreateProductVariantDto) {
    const {
      product_id,
      size,
      color,
      material,
      sku,
      price,
      stock_quantity,
      low_stock_threshold,
      weight,
      is_available,
    } = dto;

    const product = await this.prisma.product.findUnique({
      where: { product_id: Number(product_id) },
    });

    if (!product) throw new BadRequestException({ code: 400, message: 'Product not found' });

    // Validate required fields
    if (!size || !color || !sku || price === undefined || stock_quantity === undefined) {
       throw new BadRequestException({ code: 400, message: 'Incomplete variant data' });
    }

    const product_variant = await this.prisma.productVariant.create({
      data: {
        product_id: Number(product_id),
        size,
        color,
        material,
        sku,
        price: new Decimal(price), // Fix Decimal
        stock_quantity: Number(stock_quantity),
        low_stock_threshold: Number(low_stock_threshold),
        weight: new Decimal(weight), // Fix Decimal
        is_available: is_available ?? true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      code: 200,
      message: 'Product Variant added successfully',
      Product_Variant: product_variant,
    };
  }
}