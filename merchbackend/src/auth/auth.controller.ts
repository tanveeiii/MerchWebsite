import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, resetDto, resetRequestDto, SignUpDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = this.authService.login(dto);
    return user;
  }

  @Post('otp/request')
  requestOtp(@Body() dto: LoginDto) {
    return this.authService.requestOtp(dto);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() signupDTO: SignUpDto) {
    const user = await this.authService.signup(signupDTO);
    return { success: true, user };
  }

  @Post('resetPasswordRequest')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendResetLink(@Body() resetDto: resetRequestDto) {
    return this.authService.sendResetLink(resetDto);
  }

  @Post('resetPassword')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  resetPassword(@Body() dto: resetDto) {
    console.log("DTO: ", dto)
    return this.authService.resetPassword(dto);
  }
}
