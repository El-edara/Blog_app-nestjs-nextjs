import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

describe('AdminService', () => {
  let adminService: AdminService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    post: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    comment: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adminService).toBeDefined();
  });

  describe('getStats', () => {
    it('should return correct stats', async () => {
      mockPrismaService.user.count.mockResolvedValue(10);
      mockPrismaService.post.count
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(15);
      mockPrismaService.comment.count.mockResolvedValue(30);

      const result = await adminService.getStats();

      expect(result).toEqual({
        totalUsers: 10,
        totalPosts: 20,
        totalComments: 30,
        publishedPosts: 15,
        draftPosts: 5, // 20 - 15
      });

      expect(mockPrismaService.user.count).toHaveBeenCalled();
      expect(mockPrismaService.post.count).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.comment.count).toHaveBeenCalled();
    });
  });

  describe('getRecentActivity', () => {
    it('should return recent activity data', async () => {
      const mockRecentData = {
        recentUsers: [{ id: 1, name: 'User1' }],
        recentPosts: [{ id: 1, title: 'Post1' }],
        recentComments: [{ id: 1, description: 'Comment1' }],
      };

      mockPrismaService.user.findMany.mockResolvedValue(
        mockRecentData.recentUsers,
      );
      mockPrismaService.post.findMany.mockResolvedValue(
        mockRecentData.recentPosts,
      );
      mockPrismaService.comment.findMany.mockResolvedValue(
        mockRecentData.recentComments,
      );

      const result = await adminService.getRecentActivity();

      expect(result).toEqual(mockRecentData);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with counts', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'User1',
          email: 'user1@test.com',
          _count: { posts: 5, comments: 3 },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await adminService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 1;
      const mockUser = { id: userId, name: 'Test User' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await adminService.deleteUser(userId);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(adminService.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(adminService.deleteUser(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('changeUserRole', () => {
    it('should change user role successfully', async () => {
      const userId = 1;
      const newRole = Role.ADMIN;
      const mockUser = { id: userId, name: 'Test User', role: Role.USER };
      const updatedUser = { ...mockUser, role: newRole };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await adminService.changeUserRole(userId, newRole);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: newRole },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      const newRole = Role.ADMIN;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        adminService.changeUserRole(userId, newRole),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts with author and counts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post',
          author: { id: 1, name: 'Author' },
          _count: { comments: 5 },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await adminService.getAllPosts();

      expect(result).toEqual(mockPosts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully', async () => {
      const postId = 1;
      const mockPost = { id: postId, title: 'Test Post' };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await adminService.deletePost(postId);

      expect(result).toEqual({ message: 'Post deleted successfully' });
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 999;

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(adminService.deletePost(postId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('togglePostPublish', () => {
    it('should toggle post publish status', async () => {
      const postId = 1;
      const published = true;
      const mockPost = { id: postId, title: 'Test Post', published: false };
      const updatedPost = { ...mockPost, published };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue(updatedPost);

      const result = await adminService.togglePostPublish(postId, published);

      expect(result).toEqual(updatedPost);
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { published },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 999;
      const published = true;

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        adminService.togglePostPublish(postId, published),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllComments', () => {
    it('should return all comments with author and post', async () => {
      const mockComments = [
        {
          id: 1,
          description: 'Test Comment',
          author: { id: 1, name: 'Author' },
          post: { id: 1, title: 'Post Title' },
        },
      ];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await adminService.getAllComments();

      expect(result).toEqual(mockComments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      const commentId = 1;
      const mockComment = { id: commentId, description: 'Test Comment' };

      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await adminService.deleteComment(commentId);

      expect(result).toEqual({ message: 'Comment deleted successfully' });
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      const commentId = 999;

      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(adminService.deleteComment(commentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
