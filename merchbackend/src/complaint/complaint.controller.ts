import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto, ResolveComplaintDto } from './complaint.dto';

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

  // --- ADMIN: Resolve Complaint (NEW) ---
  @Patch('resolve/:id')
  async resolve(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: ResolveComplaintDto
  ) {
    return this.complaintService.resolve(id, dto);
  }
}