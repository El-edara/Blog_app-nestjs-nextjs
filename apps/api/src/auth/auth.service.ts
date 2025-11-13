import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { omit } from 'lodash';
import { User } from '@prisma/client';
import { AuthJwtPayload } from 'src/types/auth.jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private excludePassword<T extends { password: string }>(user: T) {
    return omit(user, ['password']);
  }
  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    const safeUsers = users.map((user) => omit(user, ['password']));
    return safeUsers;
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
      },
    });

    return this.excludePassword(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) throw new UnauthorizedException('Credentials incorrect');
    return this.excludePassword(user);
  }

  async generateToken(user: User) {
    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return { accessToken, refreshToken };
  }

  async login(user: User) {
    const dbUser = await this.userService.findByEmail(user.email);
    if (!dbUser) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateToken(dbUser);
    await this.updateRefreshToken(dbUser.id, refreshToken);

    return {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
      accessToken,
      refreshToken,
      message: 'Login successful',
    };
  }

  async refreshToken(user: User) {
    const dbUser = await this.userService.findOneById(user.id);
    if (!dbUser) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateToken(dbUser);
    await this.updateRefreshToken(dbUser.id, refreshToken);

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      accessToken,
      refreshToken,
    };
  }

  async findById(id: number) {
    const user = await this.userService.findOneById(id);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.excludePassword(user);
  }

  async validateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userService.findOneById(id);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const isValid = await argon2.verify(user.hashedRefreshToken, refreshToken);
    if (!isValid) throw new UnauthorizedException('Refresh token mismatch');
    return this.excludePassword(user);
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }
}
