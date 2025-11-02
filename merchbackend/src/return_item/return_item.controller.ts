import { Body, Controller, Post } from '@nestjs/common';
import { ReturnItemService } from './return_item.service';
import { CreateReturnItemDto } from './return_item.dto';

@Controller('return_item')
export class ReturnItemController {
  constructor(private readonly returnItemService: ReturnItemService) {}

  @Post('add')
  async create(@Body() dto: CreateReturnItemDto) {
    return this.returnItemService.create(dto);
  }
}
