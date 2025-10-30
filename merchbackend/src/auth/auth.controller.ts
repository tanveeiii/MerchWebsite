import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./login.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = this.authService.login(dto);
        return user
    }

    @Post('otp/request')
    requestOtp(@Body() dto: LoginDto) {
        return this.authService.requestOtp(dto);
    }

    @Post('signup')
    signup() {
        return this.authService.signup()
    }
}