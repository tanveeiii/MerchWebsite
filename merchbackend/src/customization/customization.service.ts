import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomizationDto } from './customization.dto';

@Injectable()
export class CustomizationService {
  constructor(private prisma: PrismaService) {}

  // 1. Create for Cart (Existing)
  async create(createCustomizationDto: CreateCustomizationDto) {
    const cartItem = await this.prisma.cart.findUnique({
      where: { cart_id: Number(createCustomizationDto.cart_id) },
    });

    if (!cartItem) {
      throw new BadRequestException({
        code: 400,
        message: 'Cart Item does not exist',
      });
    }

    // Check if customization already exists for this cart item
    const existing = await this.prisma.customization.findUnique({
      where: { cart_id: cartItem.cart_id }
    });

    if (existing) {
        // Update existing
        return await this.prisma.customization.update({
            where: { customization_id: existing.customization_id },
            data: {
                front_image_url: createCustomizationDto.front_image_url,
                back_image_url: createCustomizationDto.back_image_url,
                custom_text: createCustomizationDto.custom_text,
                font_style: createCustomizationDto.font_style,
                text_color: createCustomizationDto.text_color,
            }
        });
    }

    return await this.prisma.customization.create({
      data: {
        cart_id: cartItem.cart_id,
        front_image_url: createCustomizationDto.front_image_url,
        back_image_url: createCustomizationDto.back_image_url,
        custom_text: createCustomizationDto.custom_text,
        font_style: createCustomizationDto.font_style,
        text_color: createCustomizationDto.text_color,
      },
    });
  }

  async update(dto: CreateCustomizationDto) {
     // Not strictly needed if we handle upsert in create, but good to have
  }

  // --- NEW: Transfer Customization to Order ---
  async attachToOrderItem(cartId: number, orderItemId: number) {
    const customization = await this.prisma.customization.findUnique({
      where: { cart_id: cartId },
    });

    if (customization) {
      // Move from Cart to OrderItem (Set cart_id to null so it doesn't get deleted if cart is wiped)
      await this.prisma.customization.update({
        where: { customization_id: customization.customization_id },
        data: {
          cart_id: null, 
          order_item_id: orderItemId,
        },
      });
    }
  }
}