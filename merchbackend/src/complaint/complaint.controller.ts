import { Body, Controller, Post } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './complaint.dto';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('create')
  async create(@Body() dto: CreateComplaintDto) {
    return this.complaintService.create(dto);
  }
}
