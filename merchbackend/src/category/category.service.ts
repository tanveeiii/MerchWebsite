import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE CATEGORY
  async create(dto: CreateCategoryDto) {
    const { category_name, description, is_active, image_url } = dto;
    if (!category_name || !description || !image_url) {
      throw new BadRequestException({
        code: 400,
        message: 'Incomplete data provided',
      });
    }

    const slug = slugify(category_name, { lower: true, strict: true });
    const category = await this.prisma.category.create({
      data: {
        category_name: category_name,
        slug: slug,
        description: description,
        is_active: Boolean(is_active ?? true), // Default to true if undefined
        image_url: image_url,
        created_at: new Date(),
        updated_at: new Date(),
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

  // 2. UPDATE CATEGORY
  async update(dto: CreateCategoryDto) {
    const { category_id, category_name, description, is_active, image_url } = dto;
    
    const existingCategory = await this.prisma.category.findUnique({
      where: { category_id: Number(category_id) },
    });

    if (!existingCategory)
      throw new NotFoundException({ code: 404, message: 'Category not found' });

    const updated_data: any = { updated_at: new Date() };
    if (category_name) {
        updated_data.category_name = category_name;
        updated_data.slug = slugify(category_name, { lower: true, strict: true });
    }
    if (description) updated_data.description = description;
    if (is_active !== undefined) updated_data.is_active = is_active;
    if (image_url) updated_data.image_url = image_url;

    const category = await this.prisma.category.update({
      where: { category_id: Number(category_id) },
      data: updated_data,
      select: {
        category_id: true,
        category_name: true,
        description: true,
        is_active: true,
        image_url: true,
      },
    });

    return category;
  }

  // 3. NEW: FETCH ALL CATEGORIES
  async findAll() {
    return await this.prisma.category.findMany({
        orderBy: { category_name: 'asc' }
    });
  }
}