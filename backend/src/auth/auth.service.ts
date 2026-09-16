import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import type { UserDocument } from '../users/schemas/user.schema.js';
import type { LoginDto } from './dto/login.dto.js';
import type { SignupDto } from './dto/signup.dto.js';

const SALT_ROUNDS = 10;
const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResult {
  accessToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'user',
    });

    return { accessToken: this.signToken(user), user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return { accessToken: this.signToken(user), user: this.sanitizeUser(user) };
  }

  private signToken(user: UserDocument): string {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }

  private sanitizeUser(user: UserDocument): SafeUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
