import { Body, Controller, Post, Put, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './userUpdate.dto';
import { AddAddressDto } from './address.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // --- NEW: Get Profile Endpoint ---
  @Get('profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getProfile(id);
  }

  @Put('update')
  update(@Body() dto: UpdateUserDto) {
    return this.userService.update(dto);
  }

  @Post('address')
  addAddress(@Body() dto: AddAddressDto) {
    return this.userService.addAddress(dto);
  }
}