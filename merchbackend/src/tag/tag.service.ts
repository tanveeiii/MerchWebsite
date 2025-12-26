import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './tag.dto';
import slugify from 'slugify';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE TAG
  async create(dto: CreateTagDto) {
    const { tag_name } = dto;
    if (!tag_name)
      throw new BadRequestException({
        code: 400,
        message: 'Tag Name not provided',
      });
    
    const slug = slugify(tag_name, { lower: true, strict: true });
    
    const tag = await this.prisma.tag.create({
      data: {
        tag_name: tag_name,
        slug: slug,
        created_at: new Date(),
      },
      select: {
        tag_name: true,
        tag_id: true,
        created_at: true,
      },
    });
    return tag;
  }

  // 2. UPDATE TAG
  async update(dto: CreateTagDto) {
    const { tag_id, tag_name } = dto;
    const tag_int = Number(tag_id);
    
    const existingTag = await this.prisma.tag.findUnique({
      where: { tag_id: tag_int },
    });

    if (!existingTag)
      throw new NotFoundException({ code: 404, message: 'Tag not found' });

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

  // 3. FETCH ALL TAGS
  async findAll() {
    return await this.prisma.tag.findMany({
        orderBy: { tag_name: 'asc' }
    });
  }

  // 4. DELETE TAG
  async delete(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { tag_id: id },
    });

    if (!tag) throw new NotFoundException('Tag not found');

    try {
      await this.prisma.tag.delete({
        where: { tag_id: id },
      });
      return { code: 200, message: 'Tag deleted successfully' };
    } catch (e) {
      throw new InternalServerErrorException(
        'Cannot delete tag. It might be used by products.',
      );
    }
  }
}