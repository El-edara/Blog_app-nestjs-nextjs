import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../../types/auth.jwtPayload';
import { Role } from '@prisma/client';
import jwtConfig from '../config/jwt.config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: AuthService;

  const mockAuthService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig],
        }),
      ],
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtService,
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should validate and return user when token is valid', async () => {
      const payload: AuthJwtPayload = {
        sub: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      mockAuthService.findById.mockResolvedValue(mockUser);

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      });
      expect(authService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const payload: AuthJwtPayload = {
        sub: 999,
        email: 'nonexistent@test.com',
        name: 'Nonexistent User',
        role: Role.USER,
      };

      mockAuthService.findById.mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
