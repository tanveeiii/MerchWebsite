import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, AdminLoginDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  // --- ADDED THIS ENDPOINT ---
  @Post('login')
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  @Get('dashboard')
  async getDashboardData() {
    return this.adminService.getDashboardData();
  }
}
