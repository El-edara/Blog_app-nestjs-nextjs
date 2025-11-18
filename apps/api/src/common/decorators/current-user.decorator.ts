import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | User[keyof User] | null => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as User;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
