import { Role } from '@prisma/client';

export interface AuthJwtPayload {
  sub: number;
  name?: string;
  email?: string;
  role?: Role;
}
