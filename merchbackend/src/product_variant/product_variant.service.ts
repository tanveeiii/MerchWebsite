import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductVariantDto } from './product_variant.dto';

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
    if (
      !product ||
      !size ||
      !color ||
      !material ||
      !sku ||
      !price ||
      !stock_quantity ||
      !low_stock_threshold ||
      !weight ||
      !is_available
    )
      throw new BadRequestException({
        code: 400,
        message: 'Incomplete data provided',
      });

    const product_variant = await this.prisma.productVariant.create({
      data: {
        product_id: Number(product_id),
        size,
        color,
        material,
        sku,
        price,
        stock_quantity: Number(stock_quantity),
        low_stock_threshold: Number(low_stock_threshold),
        weight,
        is_available: Boolean(is_available),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
      select: {
        product_variant_id: true,
        product_id: true,
        size: true,
        color: true,
        material: true,
        sku: true,
        price: true,
        stock_quantity: true,
        low_stock_threshold: true,
        weight: true,
        is_available: true,
      },
    });

    return {
      code: '200',
      message: 'Product Variant added successfully',
      Product_Variant: product_variant,
    };
  }
}
