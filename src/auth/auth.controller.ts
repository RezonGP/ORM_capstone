import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('register')

  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
