import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ProductModule } from 'src/product/product.module'; // Import to access product data
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ProductModule], 
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
})
export class ChatModule {}