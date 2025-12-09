import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomizationDto } from './customization.dto';

@Injectable()
export class CustomizationService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomizationDto: CreateCustomizationDto) {
    // UPDATED LOGIC: Look for CART, not OrderItem
    const cartItem = await this.prisma.cart.findUnique({
      where: { cart_id: Number(createCustomizationDto.cart_id) },
    });

    if (!cartItem) {
      throw new BadRequestException({
        code: 400,
        message: 'Cart Item does not exist', // <--- New error message
      });
    }

    const customization = await this.prisma.customization.create({
      data: {
        cart_id: cartItem.cart_id, // Link to Cart
        front_image_url: createCustomizationDto.front_image_url,
        back_image_url: createCustomizationDto.back_image_url,
        custom_text: createCustomizationDto.custom_text,
        font_style: createCustomizationDto.font_style,
        text_color: createCustomizationDto.text_color,
      },
      select: {
        customization_id: true,
        cart_id: true,
        front_image_url: true,
        text_color: true,
      },
    });

    return customization;
  }

  async update(dto: CreateCustomizationDto) {
     // update logic here
  }
}