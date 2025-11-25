import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User, Role } from '@prisma/client';
import type { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    findAll: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    findById: jest.fn(),
    refreshToken: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com', name: 'User1' },
        { id: 2, email: 'user2@test.com', name: 'User2' },
      ];
      mockAuthService.findAll.mockResolvedValue(mockUsers);

      const result = await authController.findAll();

      expect(result).toEqual(mockUsers);
      expect(authService.findAll).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 1,
        ...registerDto,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await authController.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user and set cookies', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      const mockLoginResult = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        message: 'Login successful',
      };

      const mockReq = { user: mockUser };
      const mockRes = mockResponse();

      mockAuthService.login.mockResolvedValue(mockLoginResult);

      const result = await authController.login(
        mockReq as any,
        mockRes as Response,
      );

      expect(result).toEqual({
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          role: Role.USER,
        },
        message: 'Login successful',
      });

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'access-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 15 * 60 * 1000, // 15 minutes
        }),
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }),
      );

      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('logout', () => {
    it('should logout user and clear cookies', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      const mockReq = { user: mockUser };
      const mockRes = mockResponse();

      mockAuthService.logout.mockResolvedValue({
        message: 'Logged out successfully',
      });

      const result = await authController.logout(
        mockReq as any,
        mockRes as Response,
      );

      expect(result).toEqual({ message: 'Logout successful' });

      expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      expect(authService.logout).toHaveBeenCalledWith(1);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
      const mockProfile = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      mockAuthService.findById.mockResolvedValue(mockProfile);

      const result = await authController.getProfile(mockUser as any);

      expect(result).toEqual(mockProfile);
      expect(authService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and set new cookies', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      };

      const mockRefreshResult = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      const mockReq = { user: mockUser };
      const mockRes = mockResponse();

      mockAuthService.refreshToken.mockResolvedValue(mockRefreshResult);

      const result = await authController.refresh(
        mockReq as any,
        mockRes as Response,
      );

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
        message: 'Token refreshed successfully',
      });

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'new-access-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
        }),
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }),
      );

      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const mockDeletedUser = { id: 1, email: 'test@test.com' };
      mockAuthService.remove.mockResolvedValue(mockDeletedUser);

      const result = await authController.delete(1);

      expect(result).toEqual(mockDeletedUser);
      expect(authService.remove).toHaveBeenCalledWith(1);
    });
  });
});
