import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './userUpdate.dto';
import { AddAddressDto } from './address.dto';

@Injectable({})
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(updateUserDTO: UpdateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: updateUserDTO.email,
      },
    });
    if (!existingUser)
      throw new NotFoundException({ code: 404, message: 'User not found' });

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

  async addAddress(addAddressDTO: AddAddressDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: addAddressDTO.email,
      },
    });
    if (!existingUser)
      throw new NotFoundException({ code: 404, message: 'User not found' });
    if (
      !addAddressDTO.street_address ||
      !addAddressDTO.postal_code ||
      !addAddressDTO.state_province
    )
      throw new BadRequestException({ code: 400, message: 'Bad Request' });
    const now = new Date();
    const user = await this.prisma.address.create({
      data: {
        user_id: existingUser.user_id,
        address_type: addAddressDTO.address_type,
        street_address: addAddressDTO.street_address,
        apartment_suite: addAddressDTO.apartment_suite,
        city: addAddressDTO.city,
        state_province: addAddressDTO.state_province,
        postal_code: addAddressDTO.postal_code,
        is_default: addAddressDTO.is_default,
        created_at: now,
        updated_at: now,
      },
      select: {
        address_id: true,
        user_id: true,
        address_type: true,
        street_address: true,
        apartment_suite: true,
        city: true,
        state_province: true,
        postal_code: true,
      },
    });

    return user;
  }
}
