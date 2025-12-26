import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(@Body() dto: ChatMessageDto) {
    return this.chatService.generateResponse(dto);
  }
}