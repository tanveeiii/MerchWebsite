import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserNotificationController } from './user_notification.controller';
import { UserNotificationService } from './user_notification.service';

@Module({
  controllers: [UserNotificationController],
  providers: [UserNotificationService, PrismaService],
})
export class UserNotificationModule {}
