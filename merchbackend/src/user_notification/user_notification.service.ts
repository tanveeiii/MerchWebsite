import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserNotificationDto } from './user_notification.dto';

@Injectable()
export class UserNotificationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserNotificationDto) {
    // return this.prisma.userNotification.create();
  }
}
