import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: createCartDto.user_id },
    });
    if (!user)
      throw new BadRequestException({
        code: 400,
        message: 'User does not exist',
      });
    const now = new Date();
    const cart = await this.prisma.cart.create({
      data: {
        user_id: user.user_id,
        product_id: createCartDto.product_id,
        product_variant_id: createCartDto.product_variant_id,
        quantity: createCartDto.quantity,
        added_at: now,
        updated_at: now,
      },
      select: {
        cart_id: true,
        user_id: true,
        product_id: true,
        product_variant_id: true,
        quantity: true,
        updated_at: true,
      },
    });

    return cart;
  }
}
