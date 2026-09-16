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
import { AddPortfolioProjectDto } from './dto/add-portfolio-project.dto.js';
import { AddSkillDto } from './dto/add-skill.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UsersService } from './users.service.js';

@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getOwnProfile(@Req() request: Request & { user: RequestUser }) {
    const user = await this.usersService.getProfile(request.user.userId);
    return { user };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateOwnProfile(
    @Req() request: Request & { user: RequestUser },
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(request.user.userId, dto);
    return { user };
  }

  @Post('me/portfolio-projects')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async addPortfolioProject(
    @Req() request: Request & { user: RequestUser },
    @Body() dto: AddPortfolioProjectDto,
  ) {
    const user = await this.usersService.addPortfolioProject(request.user.userId, dto);
    return { user };
  }

  @Patch('me/portfolio-projects/:projectId')
  @UseGuards(JwtAuthGuard)
  async updatePortfolioProject(
    @Req() request: Request & { user: RequestUser },
    @Param('projectId') projectId: string,
    @Body() dto: UpdatePortfolioProjectDto,
  ) {
    const user = await this.usersService.updatePortfolioProject(
      request.user.userId,
      projectId,
      dto,
    );
    return { user };
  }

  @Delete('me/portfolio-projects/:projectId')
  @UseGuards(JwtAuthGuard)
  async removePortfolioProject(
    @Req() request: Request & { user: RequestUser },
    @Param('projectId') projectId: string,
  ) {
    const user = await this.usersService.removePortfolioProject(request.user.userId, projectId);
    return { user };
  }

  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    const user = await this.usersService.getPublicProfile(id);
    return { user };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(id, dto);
    return { user };
  }

  @Post(':id/skills')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async addSkill(@Param('id') id: string, @Body() dto: AddSkillDto) {
    const user = await this.usersService.addSkill(id, dto.skill);
    return { user };
  }

  @Delete(':id/skills/:skill')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async removeSkill(@Param('id') id: string, @Param('skill') skill: string) {
    const user = await this.usersService.removeSkill(id, skill);
    return { user };
  }

  /** @deprecated Superseded by portfolio-project endpoints (Day 5). Kept functional. */
  @Post(':id/experiences')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async addExperience(@Param('id') id: string, @Body() dto: AddExperienceDto) {
    const user = await this.usersService.addExperience(id, dto);
    return { user };
  }

  /** @deprecated Superseded by portfolio-project endpoints (Day 5). Kept functional. */
  @Patch(':id/experiences/:experienceId')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async updateExperience(
    @Param('id') id: string,
    @Param('experienceId') experienceId: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    const user = await this.usersService.updateExperience(id, experienceId, dto);
    return { user };
  }

  /** @deprecated Superseded by portfolio-project endpoints (Day 5). Kept functional. */
  @Delete(':id/experiences/:experienceId')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async removeExperience(@Param('id') id: string, @Param('experienceId') experienceId: string) {
    const user = await this.usersService.removeExperience(id, experienceId);
    return { user };
  }
}
