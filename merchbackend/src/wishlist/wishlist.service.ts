import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWishlistDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateWishlistDto) {
    // return this.prisma.userNotification.create();
  }
}
