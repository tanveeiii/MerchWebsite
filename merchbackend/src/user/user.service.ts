import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './userUpdate.dto';

@Injectable({})
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(updateUserDTO: UpdateUserDto) {
    const now = new Date();
    let updated_data = { updated_at: now };
    if (updateUserDTO.dob) updated_data['dob'] = updateUserDTO.dob;
    if (updateUserDTO.first_name)
      updated_data['first_name'] = updateUserDTO.first_name;
    if (updateUserDTO.last_name)
      updated_data['last_name'] = updateUserDTO.last_name;
    if (updateUserDTO.mobile) updated_data['mobile'] = updateUserDTO.mobile;
    if (updateUserDTO.gender) updated_data['gender'] = updateUserDTO.gender;
    const user = await this.prisma.user.update({
      where: { email: updateUserDTO.email },
      data: updated_data,
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        mobile: true,
        dob: true,
        gender: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });

    return user;
  }
}
