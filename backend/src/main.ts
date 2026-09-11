import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Validation failed',
          errors: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        }),
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
