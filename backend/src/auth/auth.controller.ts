import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SignupDto } from './dto/signup.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { RequestUser } from './strategies/jwt.strategy.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() dto: SignupDto) {
    const result = await this.authService.signup(dto);
    return { success: true, data: result };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { success: true, data: result };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: Request & { user: RequestUser }) {
    const user = await this.usersService.findById(request.user.userId);
    if (!user) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found',
        errors: [],
      });
    }

    return {
      success: true,
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    };
  }
}
