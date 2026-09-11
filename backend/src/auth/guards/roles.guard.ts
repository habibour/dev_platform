import { ForbiddenException, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../../users/schemas/user.schema.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { RequestUser } from '../strategies/jwt.strategy.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const allowed = requiredRoles.includes(request.user?.role as UserRole);

    if (!allowed) {
      throw new ForbiddenException({
        success: false,
        statusCode: 403,
        message: 'Insufficient role',
        errors: [],
      });
    }

    return true;
  }
}
