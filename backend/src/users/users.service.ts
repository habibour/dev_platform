import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
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
}
