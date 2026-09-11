import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { RequestUser } from '../auth/strategies/jwt.strategy.js';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }

  @Get('secure')
  @UseGuards(JwtAuthGuard)
  checkSecure(@Req() request: Request & { user: RequestUser }) {
    return { success: true, data: { message: 'authenticated', user: request.user } };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  checkAdmin(@Req() request: Request & { user: RequestUser }) {
    return { success: true, data: { message: 'admin-only route', user: request.user } };
  }
}
