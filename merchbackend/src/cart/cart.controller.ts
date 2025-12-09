// merchbackend/src/cart/cart.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create')
  async create(@Body() dto: CreateCartDto) {
    return this.cartService.create(dto);
  }

  // GET /api/cart/:userId
  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findAll(userId);
  }

  // PUT /api/cart/update/:cartId
  @Put('update/:cartId')
  async update(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body() dto: UpdateCartDto
  ) {
    return this.cartService.update(cartId, dto);
  }

  // DELETE /api/cart/remove/:cartId
  @Delete('remove/:cartId')
  async remove(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.remove(cartId);
  }
}