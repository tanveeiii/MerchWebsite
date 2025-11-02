import { Body, Controller, Post } from '@nestjs/common';
import { ReturnService } from './return.service';
import { CreateReturnDto } from './return.dto';

@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post('add')
  async create(@Body() dto: CreateReturnDto) {
    return this.returnService.create(dto);
  }
}
