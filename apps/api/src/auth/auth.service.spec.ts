import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User, Role } from '@prisma/client';
import refreshJwtConfig from './config/refresh-jwt.config';
import jwtConfig from './config/jwt.config';

// Mock argon2
jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig, refreshJwtConfig],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ... باقي الـ tests تبقى كما هي بدون تغيير
  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com', password: 'hash1', name: 'User1' },
        { id: 2, email: 'user2@test.com', password: 'hash2', name: 'User2' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await authService.findAll();

      expect(result).toEqual([
        { id: 1, email: 'user1@test.com', name: 'User1' },
        { id: 2, email: 'user2@test.com', name: 'User2' },
      ]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const mockUser = {
        id: 1,
        ...registerDto,
        password: 'hashedPassword',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(argon2.hash).toHaveBeenCalledWith('password123');
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const existingUser = { id: 1, email: 'test@test.com' };
      mockUsersService.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@test.com',
        'password123',
      );

      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        'hashedPassword',
        'password123',
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.validateUser('nonexistent@test.com', 'password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser('test@test.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
        hashedRefreshToken: null,
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);
      (argon2.hash as jest.Mock).mockResolvedValue('hashedRefreshToken');
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await authService.login(mockUser as User);

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        message: 'Login successful',
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { hashedRefreshToken: 'hashedRefreshToken' },
      });
    });

    it('should throw UnauthorizedException if user not found in database', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(mockUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
        hashedRefreshToken: 'existing-hashed-token',
      };

      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed-refresh-token');
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await authService.refreshToken(mockUser as User);

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('should throw UnauthorizedException if no refresh token stored', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        hashedRefreshToken: null,
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);

      await expect(authService.refreshToken(mockUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findById', () => {
    it('should find user by id without password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: Role.USER,
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);

      const result = await authService.findById(1);

      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.USER,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(authService.findById(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate refresh token successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        hashedRefreshToken: 'hashed-refresh-token',
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateRefreshToken(1, 'refresh-token');

      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        hashedRefreshToken: 'hashed-refresh-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(
        authService.validateRefreshToken(999, 'refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token mismatch', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        hashedRefreshToken: 'hashed-refresh-token',
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateRefreshToken(1, 'wrong-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      mockPrismaService.user.update.mockResolvedValue({ id: 1 });

      const result = await authService.logout(1);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { hashedRefreshToken: null },
      });
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await authService.remove(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
