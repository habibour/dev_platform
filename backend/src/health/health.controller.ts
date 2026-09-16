import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { RequestUser } from '../auth/strategies/jwt.strategy.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { HealthService } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({
    description: 'API and database status',
    schema: { example: { success: true, data: { api: 'ok', db: 'ok' } } },
  })
  @ApiResponse({ status: 500, description: 'Unexpected error', type: ErrorResponseDto })
  check() {
    return this.healthService.check();
  }

  @Get('secure')
  @UseGuards(JwtAuthGuard)
  checkSecure(@Req() request: Request & { user: RequestUser }) {
    return { message: 'authenticated', user: request.user };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  checkAdmin(@Req() request: Request & { user: RequestUser }) {
    return { message: 'admin-only route', user: request.user };
  }
}
