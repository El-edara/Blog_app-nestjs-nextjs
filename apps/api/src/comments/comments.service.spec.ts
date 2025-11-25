import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User, Role } from '@prisma/client';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCommentDto: CreateCommentDto = {
      description: 'Test comment',
      postId: 1,
    };

    const userId = 1;

    it('should create a comment successfully', async () => {
      const mockPost = { id: 1, title: 'Test Post' };
      const mockComment = {
        id: 1,
        ...createCommentDto,
        authorId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 1, email: 'test@test.com', name: 'Test User' },
        post: { id: 1, title: 'Test Post' },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.comment.create.mockResolvedValue(mockComment);

      const result = await commentsService.create(createCommentDto, userId);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.postId },
      });
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: {
          description: createCommentDto.description,
          authorId: userId,
          postId: createCommentDto.postId,
        },
        include: {
          author: { select: { id: true, email: true, name: true } },
          post: { select: { id: true, title: true } },
        },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        commentsService.create(createCommentDto, userId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        commentsService.create(createCommentDto, userId),
      ).rejects.toThrow('Post not found');
    });
  });

  describe('findAll', () => {
    it('should return all comments when no postId provided', async () => {
      const mockComments = [
        {
          id: 1,
          description: 'Test comment 1',
          author: { id: 1, name: 'User1', avatarUrl: null },
          post: { id: 1, title: 'Post1' },
        },
        {
          id: 2,
          description: 'Test comment 2',
          author: { id: 2, name: 'User2', avatarUrl: null },
          post: { id: 2, title: 'Post2' },
        },
      ];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await commentsService.findAll();

      expect(result).toEqual(mockComments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          post: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return comments for specific post when postId provided', async () => {
      const postId = 1;
      const mockComments = [
        {
          id: 1,
          description: 'Test comment',
          postId: 1,
          author: { id: 1, name: 'User1', avatarUrl: null },
          post: { id: 1, title: 'Post1' },
        },
      ];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await commentsService.findAll(postId);

      expect(result).toEqual(mockComments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { postId },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          post: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const commentId = 1;
      const mockComment = {
        id: commentId,
        description: 'Test comment',
        author: {
          id: 1,
          name: 'User1',
          email: 'user1@test.com',
          avatarUrl: null,
        },
        post: { id: 1, title: 'Post1' },
      };

      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      const result = await commentsService.findOne(commentId);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
        include: {
          author: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          post: { select: { id: true, title: true } },
        },
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      const commentId = 999;
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(commentsService.findOne(commentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(commentsService.findOne(commentId)).rejects.toThrow(
        'Comment not found',
      );
    });
  });

  describe('update', () => {
    const updateCommentDto: UpdateCommentDto = {
      description: 'Updated comment',
    };

    const commentId = 1;

    it('should update comment successfully when user is author', async () => {
      const mockUser = { id: 1, role: Role.USER };
      const mockComment = {
        id: commentId,
        description: 'Original comment',
        authorId: 1, // Same as user id
      };

      const mockUpdatedComment = {
        ...mockComment,
        ...updateCommentDto,
        author: { id: 1, name: 'Test User' },
      };

      // Mock findOne (which uses findUnique internally)
      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValue(mockComment as any);
      mockPrismaService.comment.update.mockResolvedValue(mockUpdatedComment);

      const result = await commentsService.update(
        commentId,
        updateCommentDto,
        mockUser as User,
      );

      expect(result).toEqual(mockUpdatedComment);
      expect(commentsService.findOne).toHaveBeenCalledWith(commentId);
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        where: { id: commentId },
        data: updateCommentDto,
        include: {
          author: { select: { id: true, name: true } },
        },
      });
    });

    it('should update comment successfully when user is ADMIN', async () => {
      const mockUser = { id: 2, role: Role.ADMIN }; // Different user but ADMIN
      const mockComment = {
        id: commentId,
        description: 'Original comment',
        authorId: 1, // Different from user id
      };

      const mockUpdatedComment = {
        ...mockComment,
        ...updateCommentDto,
        author: { id: 1, name: 'Test User' },
      };

      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValue(mockComment as any);
      mockPrismaService.comment.update.mockResolvedValue(mockUpdatedComment);

      const result = await commentsService.update(
        commentId,
        updateCommentDto,
        mockUser as User,
      );

      expect(result).toEqual(mockUpdatedComment);
    });

    it('should throw ForbiddenException when user is not author nor ADMIN', async () => {
      const mockUser = { id: 2, role: Role.USER }; // Different user
      const mockComment = {
        id: commentId,
        description: 'Original comment',
        authorId: 1, // Different from user id
      };

      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValue(mockComment as any);

      await expect(
        commentsService.update(commentId, updateCommentDto, mockUser as User),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        commentsService.update(commentId, updateCommentDto, mockUser as User),
      ).rejects.toThrow('You can only update your own comments');
    });
  });

  describe('remove', () => {
    const commentId = 1;

    it('should delete comment successfully when user is author', async () => {
      const mockUser = { id: 1, role: Role.USER };
      const mockComment = {
        id: commentId,
        description: 'Test comment',
        authorId: 1, // Same as user id
      };

      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValue(mockComment as any);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await commentsService.remove(commentId, mockUser as User);

      expect(result).toEqual({ message: 'Comment deleted successfully' });
      expect(commentsService.findOne).toHaveBeenCalledWith(commentId);
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: commentId },
      });
    });

    it('should delete comment successfully when user is ADMIN', async () => {
      const mockUser = { id: 2, role: Role.ADMIN }; // Different user but ADMIN
      const mockComment = {
        id: commentId,
        description: 'Test comment',
        authorId: 1, // Different from user id
      };

      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValue(mockComment as any);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await commentsService.remove(commentId, mockUser as User);

      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should throw ForbiddenException when user is not author nor ADMIN', async () => {
      const mockUser = { id: 2, role: Role.USER }; // Different user
      const mockComment = {
        id: commentId,
        description: 'Test comment',
        authorId: 1, // Different from user id
      };

      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValue(mockComment as any);

      await expect(
        commentsService.remove(commentId, mockUser as User),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        commentsService.remove(commentId, mockUser as User),
      ).rejects.toThrow('You can only delete your own comments');
    });
  });
});
