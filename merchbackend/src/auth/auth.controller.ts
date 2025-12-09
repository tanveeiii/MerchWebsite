import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  
}
