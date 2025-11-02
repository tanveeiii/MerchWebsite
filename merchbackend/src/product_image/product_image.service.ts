import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductImageDto } from './product_image.dto';

@Injectable()
export class ProductImageService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductImageDto) {
    // return this.prisma.userNotification.create();
  }
}
