import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { UsersModule } from '../src/users/users.module.js';
import { UsersService } from '../src/users/users.service.js';

const SALT_ROUNDS = 10;

// Standalone module (Config + Mongoose + Users only) so this script never
// touches AuthModule/JwtStrategy — keeps it independent of passport wiring.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGODB_URI') }),
    }),
    UsersModule,
  ],
})
class SeedModule {}

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const usersService = app.get(UsersService);

  try {
    const name = process.env.SEED_ADMIN_NAME;
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        'SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set (see .env.example)',
      );
    }

    const existing = await usersService.findByEmail(email);
    if (existing) {
      console.log(`Admin user already exists (${email}) — nothing to do.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await usersService.create({ name, email, passwordHash, role: 'admin' });
    console.log(`Created admin user: ${email}`);
  } finally {
    await app.close();
  }
}

await seedAdmin();
