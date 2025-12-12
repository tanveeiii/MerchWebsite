import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCartDto, UpdateCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    const { user_id, product_id, product_variant_id, quantity } = createCartDto;

    // 1. Validate Input
    if (!user_id || !product_id || !quantity) {
        throw new BadRequestException("Missing required fields: user_id, product_id, or quantity.");
    }

    try {
      // 2. Check if item exists (Same User + Product + Variant)
      // We handle 'product_variant_id' being null or undefined
      const existingItem = await this.prisma.cart.findFirst({
        where: {
          user_id: Number(user_id),
          product_id: Number(product_id),
          product_variant_id: product_variant_id ? Number(product_variant_id) : null,
        },
      });

      // 3. Logic: Update if exists, Create if new
      if (existingItem) {
        return await this.prisma.cart.update({
          where: { cart_id: existingItem.cart_id },
          data: {
            quantity: existingItem.quantity + Number(quantity),
            updated_at: new Date(), // Manually refresh timestamp
          },
        });
      } else {
        return await this.prisma.cart.create({
          data: {
            user_id: Number(user_id),
            product_id: Number(product_id),
            // Pass 'undefined' if null to satisfy Prisma's optional type
            product_variant_id: product_variant_id ? Number(product_variant_id) : undefined,
            quantity: Number(quantity),
            // 'created_at' and 'updated_at' are handled by @default(now()) in schema
          },
        });
      }
    } catch (e) {
      // Log the real error to your backend terminal so you can see it
      console.error("Cart Create Error:", e); 
      throw new InternalServerErrorException("Failed to add item to cart. Check server logs.");
    }
  }

  // --- GET CART ---
  async findAll(userId: number) {
    return await this.prisma.cart.findMany({
      where: { user_id: userId },
      include: {
        product: { include: { ProductImage: true } },
        product_variant: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // --- UPDATE QTY ---
  async update(cartId: number, updateCartDto: UpdateCartDto) {
    return await this.prisma.cart.update({
      where: { cart_id: cartId },
      data: { 
        quantity: Number(updateCartDto.quantity),
        updated_at: new Date()
      },
    });
  }

  // --- REMOVE ---
  async remove(cartId: number) {
    return await this.prisma.cart.delete({
      where: { cart_id: cartId },
    });
  }
}