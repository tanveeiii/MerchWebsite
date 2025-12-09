import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReturnService } from './return.service';
import { CreateReturnDto } from './return.dto';

@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post('create')
  async create(@Body() dto: CreateReturnDto) {
    return this.returnService.create(dto);
  }

  // GET /api/return/:userId
  @Get(':userId')
  async findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.returnService.findAll(userId);
  }
}