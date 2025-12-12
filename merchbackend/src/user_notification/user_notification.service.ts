import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserNotificationDto } from './user_notification.dto';

@Injectable()
export class UserNotificationService {
  constructor(private prisma: PrismaService) {}

  // 1. Create Notification
  async create(data: CreateUserNotificationDto) {
    return await this.prisma.userNotification.create({
      data: {
        user_id: data.user_id,
        notification_type: data.notification_type, // e.g., 'ORDER', 'PROMO'
        title: data.title,
        message: data.message,
        link_url: data.link_url,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }

  // 2. Fetch User Notifications
  async findAll(userId: number) {
    return await this.prisma.userNotification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' } // Newest first
    });
  }

  // 3. Mark as Read
  async markAsRead(notificationId: number) {
    return await this.prisma.userNotification.update({
      where: { notification_id: notificationId }, // Ensure your DB ID is named 'notification_id' or 'id'
      data: { is_read: true }
    });
  }
}