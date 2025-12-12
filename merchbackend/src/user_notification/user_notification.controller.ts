import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserNotificationService } from './user_notification.service';
import { CreateUserNotificationDto } from './user_notification.dto';

@Controller('user_notification') // <--- FIXED ROUTE NAME (was 'x')
export class UserNotificationController {
  constructor(private readonly userNotificationService: UserNotificationService) {}

  @Post('create')
  async create(@Body() dto: CreateUserNotificationDto) {
    return this.userNotificationService.create(dto);
  }

  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.userNotificationService.findAll(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.userNotificationService.markAsRead(id);
  }
}