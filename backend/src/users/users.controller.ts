import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SelfOrAdminGuard } from '../auth/guards/self-or-admin.guard.js';
import type { RequestUser } from '../auth/strategies/jwt.strategy.js';
import { AddExperienceDto } from './dto/add-experience.dto.js';
import { AddSkillDto } from './dto/add-skill.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UsersService } from './users.service.js';

@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getOwnProfile(@Req() request: Request & { user: RequestUser }) {
    const user = await this.usersService.getProfile(request.user.userId);
    return { success: true, data: { user } };
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.getProfile(id);
    return { success: true, data: { user } };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(id, dto);
    return { success: true, data: { user } };
  }

  @Post(':id/skills')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async addSkill(@Param('id') id: string, @Body() dto: AddSkillDto) {
    const user = await this.usersService.addSkill(id, dto.skill);
    return { success: true, data: { user } };
  }

  @Delete(':id/skills/:skill')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async removeSkill(@Param('id') id: string, @Param('skill') skill: string) {
    const user = await this.usersService.removeSkill(id, skill);
    return { success: true, data: { user } };
  }

  @Post(':id/experiences')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async addExperience(@Param('id') id: string, @Body() dto: AddExperienceDto) {
    const user = await this.usersService.addExperience(id, dto);
    return { success: true, data: { user } };
  }

  @Patch(':id/experiences/:experienceId')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async updateExperience(
    @Param('id') id: string,
    @Param('experienceId') experienceId: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    const user = await this.usersService.updateExperience(id, experienceId, dto);
    return { success: true, data: { user } };
  }

  @Delete(':id/experiences/:experienceId')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async removeExperience(@Param('id') id: string, @Param('experienceId') experienceId: string) {
    const user = await this.usersService.removeExperience(id, experienceId);
    return { success: true, data: { user } };
  }
}
