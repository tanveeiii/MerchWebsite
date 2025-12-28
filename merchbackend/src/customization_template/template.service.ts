import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTemplateDto } from './template.dto';

@Injectable()
export class CustomizationTemplateService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTemplateDto) {
    return await this.prisma.customizationTemplate.create({
      data: {
        name: dto.name,
        description: dto.description,
        preview_image: dto.preview_image,
        data: dto.data,
      },
    });
  }

  async findAll() {
    return await this.prisma.customizationTemplate.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async delete(id: number) {
    return await this.prisma.customizationTemplate.delete({
      where: { template_id: id }
    });
  }
}