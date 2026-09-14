import { ForbiddenException, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { RequestUser } from '../strategies/jwt.strategy.js';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: RequestUser; params: Record<string, string> }>();

    const isSelf = request.user?.userId === request.params.id;
    const isAdmin = request.user?.role === 'admin';

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException({
        success: false,
        statusCode: 403,
        message: 'You can only modify your own profile',
        errors: [],
      });
    }

    return true;
  }
}
