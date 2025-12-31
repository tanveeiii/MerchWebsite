import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAdminDto, AdminLoginDto } from './admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // 1. Create Admin
  async create(createAdminDTO: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDTO.email },
    });
    if (existingAdmin)
      throw new BadRequestException({
        code: 400,
        message: 'Admin already exists',
      });

    // Hash password before saving
    const hashed = await bcrypt.hash(createAdminDTO.password, 10);
    const now = new Date();

    const admin = await this.prisma.admin.create({
      data: {
        first_name: createAdminDTO.first_name,
        last_name: createAdminDTO.last_name,
        email: createAdminDTO.email,
        phone_number: createAdminDTO.phone_number,
        password: hashed,
        created_at: now,
        updated_at: now,
        access_token: '',
      },
      select: {
        admin_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
      },
    });

    return admin;
  }

  // 2. Admin Login (NEW)
  async login(loginDto: AdminLoginDto) {
    console.log(loginDto);
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });
    console.log(admin);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare plain text password with hashed password in DB
    const isMatch = await bcrypt.compare(loginDto.password, admin.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return admin info (excluding password)
    return {
      message: 'Login successful',
      admin: {
        id: admin.admin_id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
        role: 'SUPER_ADMIN',
      },
    };
  }

  async getDashboardData() {
    const totalOrders = await this.prisma.order.count();
    const totalSales = await this.prisma.order.aggregate({
      _sum: {
        total_amount: true,
      },
      where: {
        order_status: {
          in: ['DELIVERED'],
        },
      },
    });
    const totalProducts = await this.prisma.product.count({
      where: { is_active: true },
    });
    const activeUsers = await this.prisma.user.count();
    const recentOrders = await this.prisma.order.findMany({
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
    });
    return {
      stats: {
        totalSales: totalSales._sum.total_amount ?? 0,
        totalOrders,
        totalProducts,
        activeUsers,
      },
      recentOrders,
    };
  }
}
