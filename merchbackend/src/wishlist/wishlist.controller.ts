import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('create')
  async create(@Body() dto: CreateWishlistDto) {
    return this.wishlistService.create(dto);
  }

  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.wishlistService.findAll(userId);
  }

  @Delete('remove/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistService.remove(id);
  }
}