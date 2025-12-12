import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './complaint.dto';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('create')
  async create(@Body() dto: CreateComplaintDto) {
    return this.complaintService.create(dto);
  }

  // --- ADMIN: Fetch All Complaints ---
  @Get('admin/all')
  async findAll() {
    return this.complaintService.findAll();
  }
}