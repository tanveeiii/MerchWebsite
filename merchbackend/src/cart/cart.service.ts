import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCartDto, UpdateCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE
  async create(createCartDto: CreateCartDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: createCartDto.user_id },
    });
    if (!user) throw new BadRequestException('User does not exist');

    // FIX 1: Added added_at and updated_at
    const now = new Date(); 

    return await this.prisma.cart.create({
      data: {
        user_id: user.user_id,
        product_id: createCartDto.product_id,
        product_variant_id: createCartDto.product_variant_id,
        quantity: createCartDto.quantity,
        added_at: now,   // <--- Added
        updated_at: now, // <--- Added
      },
    });
  }

  // 2. GET ALL ITEMS
  async findAll(userId: number) {
    return await this.prisma.cart.findMany({
      where: { user_id: userId },
      include: {
        // FIX 2: Removed 'select' to avoid guessing field names. 
        // We fetch the whole product object now.
        product: true, 
        customization: true
      }
    });
  }

  // 3. UPDATE QUANTITY
  async update(cartId: number, updateCartDto: UpdateCartDto) {
    const cartItem = await this.prisma.cart.findUnique({ where: { cart_id: cartId } });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    return await this.prisma.cart.update({
      where: { cart_id: cartId },
      data: { 
        quantity: updateCartDto.quantity,
        updated_at: new Date(), // Update timestamp
      },
    });
  }

  // 4. DELETE ITEM
  async remove(cartId: number) {
    const cartItem = await this.prisma.cart.findUnique({ where: { cart_id: cartId } });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    return await this.prisma.cart.delete({
      where: { cart_id: cartId },
    });
  }
}