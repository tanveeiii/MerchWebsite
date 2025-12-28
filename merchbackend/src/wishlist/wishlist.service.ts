import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWishlistDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // 1. ADD TO WISHLIST
  async create(data: CreateWishlistDto) {
    const { user_id, product_id, product_variant_id } = data;

    // Check if User exists
    const user = await this.prisma.user.findUnique({
      where: { user_id: Number(user_id) },
    });
    if (!user) throw new BadRequestException('User not found');

    // Check duplicates
    const existing = await this.prisma.wishlist.findFirst({
      where: {
        user_id: Number(user_id),
        product_id: Number(product_id),
        // Fix: Use undefined instead of null/conditional check inside where
        product_variant_id: product_variant_id
          ? Number(product_variant_id)
          : undefined,
      },
    });

    if (existing) {
      throw new BadRequestException('Item already in wishlist');
    }

    return await this.prisma.wishlist.create({
      data: {
        user_id: Number(user_id),
        product_id: Number(product_id),
        // FIX 1: Pass undefined instead of null
        product_variant_id: product_variant_id
          ? Number(product_variant_id)
          : undefined,
        // created_at: new Date() // Removed because schema likely doesn't have it yet
      },
    });
  }

  // 2. GET USER WISHLIST
  async findAll(userId: number) {
    return await this.prisma.wishlist.findMany({
      where: { user_id: userId },
      include: {
        product: {
          include: {
            ProductImage: true,
            categories: true,
          },
        },
        product_variant: true,
      },
      // FIX 2: Sort by ID instead of missing 'created_at' field
      orderBy: { wishlist_id: 'desc' },
    });
  }

  // 3. REMOVE ITEM
  async remove(wishlistId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { wishlist_id: wishlistId },
    });
    if (!item) throw new NotFoundException('Item not found');

    return await this.prisma.wishlist.delete({
      where: { wishlist_id: wishlistId },
    });
  }
}
