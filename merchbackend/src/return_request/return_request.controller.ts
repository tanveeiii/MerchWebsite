import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ReturnRequestService } from './return_request.service';
import { CreateReturnRequestDto } from './return_request.dto';

@Controller('return-request')
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) {}

  @Post('create')
  async create(@Body() dto: CreateReturnRequestDto) {
    return this.returnRequestService.create(dto);
  }

  @Get('pending')
  async findAllPending() {
    return this.returnRequestService.findAllPending();
  }

  @Put('approve/:id')
  async approve(@Param('id', ParseIntPipe) id: number) {
    return this.returnRequestService.approveRequest(id);
  }

  @Put('reject/:id')
  async reject(@Param('id', ParseIntPipe) id: number) {
    return this.returnRequestService.rejectRequest(id);
  }
}