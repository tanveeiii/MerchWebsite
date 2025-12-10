import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    
    // Added 'await' here
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
    
    const existingTag = await this.prisma.tag.findUnique({ // Changed findFirst to findUnique for ID
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

  // 3. NEW: FETCH ALL TAGS (Required for frontend integration)
  async findAll() {
    return await this.prisma.tag.findMany({
        orderBy: { tag_name: 'asc' }
    });
  }
}