import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAdminDto } from './admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDTO: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDTO.email },
    });
    if (existingAdmin)
      throw new BadRequestException({
        code: 400,
        message: 'Admin already exists',
      });
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
}
