import { Body, Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './userUpdate.dto';
import { AddAddressDto } from './address.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('update')
  update(@Body() dto: UpdateUserDto) {
    return this.userService.update(dto);
  }

  @Post('address')
  addAddress(@Body() dto: AddAddressDto) {
    return this.userService.addAddress(dto);
  }
}
