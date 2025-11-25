import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

// Mock argon2
jest.mock('argon2', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const mockUser = {
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        role: Role.USER,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await usersService.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(argon2.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findOneById(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(usersService.findOneById(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usersService.findOneById(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';
      const mockUser = {
        id: 1,
        email,
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should throw error if email is not provided', async () => {
      await expect(usersService.findByEmail('')).rejects.toThrow(
        'Email is required',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users with counts', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@test.com',
          name: 'User 1',
          avatarUrl: null,
          role: Role.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { posts: 5, comments: 3 },
        },
        {
          id: 2,
          email: 'user2@test.com',
          name: 'User 2',
          avatarUrl: null,
          role: Role.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { posts: 2, comments: 1 },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await usersService.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user with posts and comments', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'test@test.com',
        name: 'Test User',
        avatarUrl: null,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [{ id: 1, title: 'Post 1', published: true }],
        comments: [{ id: 1, description: 'Comment 1' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(usersService.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usersService.findOne(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });
  });

  describe('update', () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@test.com',
    };

    it('should update user successfully', async () => {
      const existingUser = {
        id: userId,
        name: 'Original Name',
        email: 'original@test.com',
      };

      const updatedUser = {
        ...existingUser,
        ...updateUserDto,
        password: undefined,
      };

      // Mock findOne to check if user exists
      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser as any);
      mockPrismaService.user.findUnique.mockResolvedValue(null); // No conflict
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await usersService.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
    });

    it('should hash password if provided', async () => {
      const updateWithPassword: UpdateUserDto = {
        password: 'newpassword',
      };
      const hashedPassword = 'hashedNewPassword';

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue({ id: userId } as any);
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.update.mockResolvedValue({ id: userId });

      await usersService.update(userId, updateWithPassword);

      expect(argon2.hash).toHaveBeenCalledWith('newpassword');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateWithEmail: UpdateUserDto = {
        email: 'existing@test.com',
      };
      const existingUserWithDifferentId = {
        id: 2, // Different user
        email: 'existing@test.com',
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue({ id: userId } as any);
      mockPrismaService.user.findUnique.mockResolvedValue(
        existingUserWithDifferentId,
      );

      await expect(
        usersService.update(userId, updateWithEmail),
      ).rejects.toThrow(ConflictException);
      await expect(
        usersService.update(userId, updateWithEmail),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('updateAvatar', () => {
    it('should update user avatar', async () => {
      const userId = 1;
      const avatarUrl = 'https://example.com/avatar.jpg';
      const mockUser = {
        id: userId,
        avatarUrl,
      };

      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await usersService.updateAvatar(userId, avatarUrl);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { avatarUrl },
      });
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const userId = 1;
      const mockUser = { id: userId, name: 'Test User' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as any);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await usersService.remove(userId);

      expect(result).toEqual({
        message: `User with ID ${userId} has been deleted`,
      });
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('excludePassword', () => {
    it('should remove password from user object', () => {
      const userWithPassword = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        password: 'secret',
        role: Role.USER,
      };

      const result = (usersService as any).excludePassword(userWithPassword);

      expect(result.password).toBeUndefined();
      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: Role.USER,
      });
    });
  });
});
