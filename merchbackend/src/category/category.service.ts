import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './category.dto';
import slugify from 'slugify';

@Injectable({})
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async add(dto: CreateCategoryDto) {
    const { category_name, description, is_active, image_url } = dto;
    if (!category_name || !description || !image_url || !is_active)
      throw new BadRequestException({
        code: 400,
        message: 'Incomplete data provided',
      });

    const slug = slugify(category_name, { lower: true, strict: true });
    const category = await this.prisma.category.create({
      data: {
        category_name: category_name,
        slug: slug,
        description: description,
        is_active: is_active,
        image_url: image_url,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
      select: {
        category_name: true,
        slug: true,
        description: true,
        category_id: true,
        is_active: true,
      },
    });

    return { code: '200', message: 'Category added successfully', category };
  }
}
