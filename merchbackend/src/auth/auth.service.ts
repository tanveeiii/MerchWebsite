import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { identity } from "rxjs";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService
    ) { }
    async login(dto: LoginDto) {
        const { identity, password, otp } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identity },
                    { mobile: identity }
                ]
            }
        });
        if (!user) throw new NotFoundException({ code: 404, message: 'User not found' });
        if (password) {
            const check = await bcrypt.compare(password, user.password);
            if (!check) throw new UnauthorizedException({ code: 401, message: 'Invalid password' });
            const payload = {
                sub: user.user_id,
                iat: Math.floor(Date.now() / 1000),
            };
            const token = this.jwt.sign(payload, {
                expiresIn: '1d',
            });
            await this.prisma.user.update({
                where: { user_id: user.user_id },
                data: { last_login: new Date(), access_token: token }
            });
            return { code: 200, message: "Successful login", id: user.user_id, token };
        }
        if (otp) {
            if (!user.otp_hashed || !user.otp_expiry) throw new UnauthorizedException({ code: 401, message: "otp expired" });
            if (new Date() > new Date(user.otp_expiry)) {
                await this.prisma.user.update({
                    where: { user_id: user.user_id },
                    data: { otp_hashed: null, otp_expiry: null }
                });
                throw new BadRequestException({ code: 401, message: "otp expired" });
            }
            const check = await bcrypt.compare(otp, user.otp_hashed);
            if (!check) throw new UnauthorizedException({ code: 401, message: "Invalid otp" });
            const payload = {
                sub: user.user_id,
                iat: Math.floor(Date.now() / 1000),
            };
            const token = this.jwt.sign(payload, {
                expiresIn: '1d',
            });
            await this.prisma.user.update({
                where: { user_id: user.user_id },
                data: { otp_hashed: null, otp_expiry: null, access_token: token }
            });
            return { code: 200, message: "Successful login", id: user.user_id, token };
        }
        throw new BadRequestException({ code: 400, message: "Invalid login request" });
    }

    async requestOtp(dto: LoginDto) {
        const { identity } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identity },
                    { mobile: identity }
                ]
            }
        });
        if (!user) throw new BadRequestException({ code: 400, message: "User not found" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 64);
        const expiry = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.user.update({
            where: { user_id: user.user_id },
            data: { otp_hashed: otpHash, otp_expiry: expiry }
        })

        //send otp
        return { code: 200, message: "otp sent succcessfully" };
    }


    signup() {
        return { msg: "Sign up succesful" }
    }
}
