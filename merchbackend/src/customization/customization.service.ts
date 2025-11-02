import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomizationDto } from './customization.dto';

@Injectable({})
export class CustomizationService {
  constructor(private prisma: PrismaService) {}
  async create(createCustomizationDto: CreateCustomizationDto) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { order_item_id: Number(createCustomizationDto.order_item_id) },
    });
    if (!orderItem)
      throw new BadRequestException({
        code: 400,
        message: 'Order Item does not exist',
      });
    const now = new Date();
    const customization = await this.prisma.customization.create({
      data: {
        order_item_id: orderItem.order_item_id,
        front_image_url: createCustomizationDto.front_image_url,
        back_image_url: createCustomizationDto.back_image_url,
        custom_text: createCustomizationDto.custom_text,
        font_style: createCustomizationDto.font_style,
        text_color: createCustomizationDto.text_color,
      },
      select: {
        order_item_id: true,
        customization_id: true,
        back_image_url: true,
        front_image_url: true,
        font_style: true,
        text_color: true,
      },
    });

    return customization;
  }

  async update(dto: CreateCustomizationDto) {
    // return tag;
  }
}
