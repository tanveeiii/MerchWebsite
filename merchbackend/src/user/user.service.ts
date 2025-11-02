import { Body, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable({})
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {}

    update() {
        return {msg: "Sign up succesful"}
    }
}