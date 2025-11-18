import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/role.guard';
import type { Response } from 'express';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async findAll() {
    return this.authService.findAll();
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(req.user);

    res.cookie('access_token', result.accessToken, {
      ...this.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 دقائق
    });

    res.cookie('refresh_token', result.refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });
    return {
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
      message: 'Login successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.id;
    await this.authService.logout(userId);

    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: { id: number }) {
    return this.authService.findById(user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(req.user);

    res.cookie('access_token', result.accessToken, {
      ...this.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 دقائق
    });

    res.cookie('refresh_token', result.refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      message: 'Token refreshed successfully',
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.authService.remove(id);
  }
}
