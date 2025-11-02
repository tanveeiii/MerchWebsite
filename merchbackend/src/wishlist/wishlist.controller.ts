import { Body, Controller, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('create')
  async create(@Body() dto: CreateWishlistDto) {
    return this.wishlistService.create(dto);
  }
}
