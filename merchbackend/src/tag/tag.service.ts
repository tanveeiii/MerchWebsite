import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './tag.dto';
import slugify from 'slugify';

@Injectable({})
export class TagService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateTagDto) {
    console.log(dto);
    const { tag_name } = dto;
    if (!tag_name)
      throw new BadRequestException({
        code: 400,
        message: 'Tag Name not provided',
      });
    const slug = slugify(tag_name, { lower: true, strict: true });
    const tag = this.prisma.tag.create({
      data: {
        tag_name: tag_name,
        slug: slug,
        created_at: new Date(Date.now()),
      },
      select: {
        tag_name: true,
        tag_id: true,
        created_at: true,
      },
    });
    return tag;
  }

  async update(dto: CreateTagDto) {
    const { tag_id, tag_name } = dto;
    const tag_int = Number(tag_id);
    console.log(typeof tag_int);
    const existingCategory = await this.prisma.tag.findFirst({
      where: {
        tag_id: tag_int,
      },
    });
    if (!existingCategory)
      throw new NotFoundException({ code: 404, message: 'Tag not found' });

    const now = new Date();
    const tag = await this.prisma.tag.update({
      where: { tag_id: tag_int },
      data: { tag_name },
      select: {
        tag_id: true,
        tag_name: true,
      },
    });

    return tag;
  }
}
