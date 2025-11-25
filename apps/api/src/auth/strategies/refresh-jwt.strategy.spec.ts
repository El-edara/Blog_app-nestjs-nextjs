import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../../types/auth.jwtPayload';
import { Role } from '@prisma/client';
import refreshJwtConfig from '../config/refresh-jwt.config';

describe('RefreshJwtStrategy', () => {
  let refreshJwtStrategy: RefreshJwtStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [refreshJwtConfig],
        }),
      ],
      providers: [
        RefreshJwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    refreshJwtStrategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should validate refresh token successfully', async () => {
      const mockReq = {
        cookies: {
          refresh_token: 'valid-refresh-token',
        },
      };

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
      };

      mockAuthService.validateRefreshToken.mockResolvedValue(mockUser);

      const result = await refreshJwtStrategy.validate(mockReq as any, payload);

      expect(result).toEqual(mockUser);
      expect(authService.validateRefreshToken).toHaveBeenCalledWith(
        1,
        'valid-refresh-token',
      );
    });

    it('should throw UnauthorizedException when no refreshToken in cookies', () => {
      const mockReq = {
        cookies: {}, // No refresh token
      };

      const payload: AuthJwtPayload = {
        sub: 1, // Has userId but no refresh token
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      // استخدم expect().toThrow() بدل await expect().rejects.toThrow()
      expect(() => {
        refreshJwtStrategy.validate(mockReq as any, payload);
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when userId is null in payload', () => {
      const mockReq = {
        cookies: {
          refresh_token: 'valid-token',
        },
      };

      const payload: AuthJwtPayload = {
        sub: null as any, // userId is null
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      expect(() => {
        refreshJwtStrategy.validate(mockReq as any, payload);
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when userId is undefined in payload', () => {
      const mockReq = {
        cookies: {
          refresh_token: 'valid-token',
        },
      };

      const payload: AuthJwtPayload = {
        sub: undefined as any, // userId is undefined
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      expect(() => {
        refreshJwtStrategy.validate(mockReq as any, payload);
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when both userId and refreshToken are missing', () => {
      const mockReq = {
        cookies: {}, // No refresh token
      };

      const payload: AuthJwtPayload = {
        sub: undefined as any, // No userId
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      expect(() => {
        refreshJwtStrategy.validate(mockReq as any, payload);
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when validateRefreshToken fails', async () => {
      const mockReq = {
        cookies: {
          refresh_token: 'invalid-refresh-token',
        },
      };

      const payload: AuthJwtPayload = {
        sub: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      mockAuthService.validateRefreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      await expect(
        refreshJwtStrategy.validate(mockReq as any, payload),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
