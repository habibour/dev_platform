import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { AddExperienceDto } from './dto/add-experience.dto.js';
import type { AddPortfolioProjectDto } from './dto/add-portfolio-project.dto.js';
import type { UpdateExperienceDto } from './dto/update-experience.dto.js';
import type { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';
import { User } from './schemas/user.schema.js';
import type { UserDocument, UserRole } from './schemas/user.schema.js';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  create(input: CreateUserInput) {
    return this.userModel.create(input);
  }

  async getProfile(id: string) {
    return this.orNotFound(await this.userModel.findById(id).exec());
  }

  async getPublicProfile(id: string) {
    const user = this.orNotFound(await this.userModel.findById(id).exec());
    const { id: userId, name, headline, bio, skills, portfolioProjects } =
      user.toJSON() as unknown as Record<string, unknown>;
    return { id: userId, name, headline, bio, skills, portfolioProjects };
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    return this.orNotFound(await this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec());
  }

  async addSkill(id: string, skill: string) {
    return this.orNotFound(
      await this.userModel
        .findByIdAndUpdate(id, { $addToSet: { skills: skill } }, { new: true })
        .exec(),
    );
  }

  async removeSkill(id: string, skill: string) {
    return this.orNotFound(
      await this.userModel.findByIdAndUpdate(id, { $pull: { skills: skill } }, { new: true }).exec(),
    );
  }

  async addExperience(id: string, dto: AddExperienceDto) {
    return this.orNotFound(
      await this.userModel
        .findByIdAndUpdate(id, { $push: { experiences: dto } }, { new: true })
        .exec(),
    );
  }

  async updateExperience(id: string, experienceId: string, dto: UpdateExperienceDto) {
    const setFields = Object.fromEntries(
      Object.entries(dto).map(([key, value]) => [`experiences.$.${key}`, value]),
    );
    const updated = await this.userModel
      .findOneAndUpdate({ _id: id, 'experiences._id': experienceId }, { $set: setFields }, { new: true })
      .exec();
    return this.orNotFound(updated, 'User or experience not found');
  }

  async removeExperience(id: string, experienceId: string) {
    return this.orNotFound(
      await this.userModel
        .findByIdAndUpdate(id, { $pull: { experiences: { _id: experienceId } } }, { new: true })
        .exec(),
    );
  }

  async addPortfolioProject(id: string, dto: AddPortfolioProjectDto) {
    return this.orNotFound(
      await this.userModel
        .findByIdAndUpdate(id, { $push: { portfolioProjects: dto } }, { new: true })
        .exec(),
    );
  }

  async updatePortfolioProject(id: string, projectId: string, dto: UpdatePortfolioProjectDto) {
    const setFields = Object.fromEntries(
      Object.entries(dto).map(([key, value]) => [`portfolioProjects.$.${key}`, value]),
    );
    const updated = await this.userModel
      .findOneAndUpdate(
        { _id: id, 'portfolioProjects._id': projectId },
        { $set: setFields },
        { new: true },
      )
      .exec();
    return this.orNotFound(updated, 'User or portfolio project not found');
  }

  async removePortfolioProject(id: string, projectId: string) {
    return this.orNotFound(
      await this.userModel
        .findByIdAndUpdate(id, { $pull: { portfolioProjects: { _id: projectId } } }, { new: true })
        .exec(),
    );
  }

  private orNotFound(user: UserDocument | null, message = 'User not found'): UserDocument {
    if (!user) {
      throw new NotFoundException(message);
    }
    return user;
  }
}
