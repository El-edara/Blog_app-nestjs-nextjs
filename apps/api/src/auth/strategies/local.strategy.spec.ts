import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should validate and return user when credentials are valid', async () => {
      const email = 'test@test.com';
      const password = 'password123';
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(email, password);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const email = 'test@test.com';
      const password = 'wrongpassword';

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
