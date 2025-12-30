import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post('send')
  async send(@Body() body: any) {
    const { token, title, message, link } = body;
    return this.service.sendToToken(token, title, message, link);
  }
}
