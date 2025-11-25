import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
<<<<<<< HEAD
import { PrismaModule } from '../prisma/prisma.module';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UsersService } from '../users/users.service';
=======
import { PrismaModule } from 'src/prisma/prisma.module';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UsersService } from 'src/users/users.service';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
