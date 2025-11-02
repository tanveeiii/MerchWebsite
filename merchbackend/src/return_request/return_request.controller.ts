import { Body, Controller, Post } from '@nestjs/common';
import { ReturnRequestService } from './return_request.service';
import { CreateReturnRequestDto } from './return_request.dto';

@Controller('return_request')
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) {}

  @Post('add')
  async create(@Body() dto: CreateReturnRequestDto) {
    return this.returnRequestService.create(dto);
  }
}
