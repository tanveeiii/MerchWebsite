import { Body, Controller, Post } from '@nestjs/common';
import { UserNotificationService } from './user_notification.service';
import { CreateUserNotificationDto } from './user_notification.dto';

@Controller('x')
export class UserNotificationController {
  constructor(private readonly userNotificationService: UserNotificationService) {}

  @Post('create')
  async create(@Body() dto: CreateUserNotificationDto) {
    return this.userNotificationService.create(dto);
  }
}
