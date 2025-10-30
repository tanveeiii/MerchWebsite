import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService
    ) { }
    async login(dto: LoginDto) {
        const { email, password, otp } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { mobile: email }
                ]
            }
        });
        if (!user) throw new UnauthorizedException({ code: 404, message: 'User not found' });
        if (password) {
            const check = bcrypt.compare(password, user.password);
            if (!check) throw new UnauthorizedException({ code: 401, message: 'Invalid password' });
            await this.prisma.user.update({
                where: { user_id: user.user_id },
                data: { last_login: new Date() }
            });
            const token = this.jwt.sign({ sub: user.user_id });
            return { code: 200, id: user.user_id, token };
        } else {

        }
    }

    signup() {
        return { msg: "Sign up succesful" }
    }
}
