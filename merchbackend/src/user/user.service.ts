import { Body, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./create-user-dto";
import { PrismaService } from "src/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable({})
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async create(createUserDTO: CreateUserDto) 
    { 
        const hashed = await bcrypt.hash(createUserDTO.password, 10);
        const now = new Date();
        const user = await this.prisma.user.create({
        data: {
          first_name: createUserDTO.first_name,
          last_name: createUserDTO.last_name,
          email: createUserDTO.email,
          mobile: createUserDTO.mobile,
          dob: new Date(createUserDTO.dob),
          password: hashed,
          gender: createUserDTO.gender.toUpperCase() as any,
          created_at: now,
          updated_at: now,
          last_login: now,
          access_token: ''
        },
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
        }
      });

      return user;
    }

    update() {
        return {msg: "Sign up succesful"}
    }
}