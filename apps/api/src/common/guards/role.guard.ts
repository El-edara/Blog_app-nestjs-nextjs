import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { role?: Role };
    console.log(
      '🧩 RolesGuard => requiredRoles:',
      requiredRoles,
      'userRole:',
      user?.role,
    );
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No role assigned');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    return requiredRoles.includes(user.role);
  }
}
