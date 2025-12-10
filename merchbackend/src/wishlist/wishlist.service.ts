import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWishlistDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // 1. ADD TO WISHLIST
  async create(data: CreateWishlistDto) {
    // Check duplicates
    const existing = await this.prisma.wishlist.findFirst({
        where: {
            user_id: data.user_id,
            product_id: data.product_id,
            product_variant_id: data.product_variant_id
        }
    });

    if (existing) {
        throw new BadRequestException('Item already in wishlist');
    }

    return await this.prisma.wishlist.create({
      data: {
        user_id: data.user_id,
        product_id: data.product_id,
        product_variant_id: data.product_variant_id
      }
    });
  }

  // 2. GET USER WISHLIST
  async findAll(userId: number) {
    return await this.prisma.wishlist.findMany({
        where: { user_id: userId },
        include: {
            product: {
                include: {
                    ProductImage: true, // To get the image
                    category: true      // To get the section name
                }
            },
            product_variant: true       // To get specific variant price if needed
        }
    });
  }

  // 3. REMOVE ITEM
  async remove(wishlistId: number) {
      const item = await this.prisma.wishlist.findUnique({ where: { wishlist_id: wishlistId }});
      if (!item) throw new NotFoundException('Item not found');

      return await this.prisma.wishlist.delete({
          where: { wishlist_id: wishlistId }
      });
  }
}