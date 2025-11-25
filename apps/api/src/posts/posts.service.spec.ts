import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { User, Role } from '@prisma/client';

describe('PostsService', () => {
  let postsService: PostsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      description: 'Test Description',
      published: true,
    };
    const userId = 1;

    it('should create a post successfully', async () => {
      const mockPost = {
        id: 1,
        ...createPostDto,
        authorId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 1, email: 'test@test.com', name: 'Test User' },
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await postsService.create(createPostDto, userId);

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostDto.title,
          description: createPostDto.description,
          published: createPostDto.published,
          authorId: userId,
        },
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all posts with pagination', async () => {
      const query: FindAllPostsDto = {
        page: 1,
        limit: 10,
      };

      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          description: 'Description 1',
          published: true,
          author: { id: 1, email: 'user1@test.com', name: 'User 1' },
          _count: { comments: 5 },
        },
        {
          id: 2,
          title: 'Post 2',
          description: 'Description 2',
          published: false,
          author: { id: 2, email: 'user2@test.com', name: 'User 2' },
          _count: { comments: 3 },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(2);

      const result = await postsService.findAll(query);

      expect(result).toEqual({
        data: mockPosts,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });
    });

    it('should filter posts by search query', async () => {
      const query: FindAllPostsDto = {
        page: 1,
        limit: 10,
        search: 'test',
      };

      const mockPosts = [
        {
          id: 1,
          title: 'Test Post',
          description: 'This is a test post',
          published: true,
          author: { id: 1, email: 'user1@test.com', name: 'User 1' },
          _count: { comments: 2 },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await postsService.findAll(query);

      expect(result.data).toEqual(mockPosts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });

    it('should filter posts by published status', async () => {
      const query: FindAllPostsDto = {
        page: 1,
        limit: 10,
        published: true,
      };

      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await postsService.findAll(query);

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          published: true,
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const postId = 1;
      const mockPost = {
        id: postId,
        title: 'Test Post',
        description: 'Test Description',
        published: true,
        author: { id: 1, email: 'test@test.com', name: 'Test User' },
        comments: [
          {
            author: { id: 2, name: 'Commenter' },
          },
        ],
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await postsService.findOne(postId);

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 999;
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(postsService.findOne(postId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(postsService.findOne(postId)).rejects.toThrow(
        `Post with ID ${postId} not found`,
      );
    });
  });

  describe('findMyPosts', () => {
    it('should return posts for specific user', async () => {
      const userId = 1;
      const mockPosts = [
        {
          id: 1,
          title: 'My Post 1',
          description: 'My Description 1',
          published: true,
          authorId: userId,
          _count: { comments: 2 },
        },
        {
          id: 2,
          title: 'My Post 2',
          description: 'My Description 2',
          published: false,
          authorId: userId,
          _count: { comments: 1 },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await postsService.findMyPosts(userId);

      expect(result).toEqual(mockPosts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { comments: true } },
        },
      });
    });
  });

  describe('update', () => {
    const postId = 1;
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Post',
      description: 'Updated Description',
    };

    it('should update post successfully when user is author', async () => {
      const mockUser = { id: 1, role: Role.USER };
      const mockPost = {
        id: postId,
        title: 'Original Post',
        description: 'Original Description',
        authorId: 1, // Same as user id
      };

      const mockUpdatedPost = {
        ...mockPost,
        ...updatePostDto,
        author: { id: 1, email: 'test@test.com', name: 'Test User' },
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost as any);
      mockPrismaService.post.update.mockResolvedValue(mockUpdatedPost);

      const result = await postsService.update(
        postId,
        updatePostDto,
        mockUser as User,
      );

      expect(result).toEqual(mockUpdatedPost);
      expect(postsService.findOne).toHaveBeenCalledWith(postId);
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: updatePostDto,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });
    });

    it('should update post successfully when user is ADMIN', async () => {
      const mockUser = { id: 2, role: Role.ADMIN }; // Different user but ADMIN
      const mockPost = {
        id: postId,
        title: 'Original Post',
        description: 'Original Description',
        authorId: 1, // Different from user id
      };

      const mockUpdatedPost = {
        ...mockPost,
        ...updatePostDto,
        author: { id: 1, email: 'test@test.com', name: 'Test User' },
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost as any);
      mockPrismaService.post.update.mockResolvedValue(mockUpdatedPost);

      const result = await postsService.update(
        postId,
        updatePostDto,
        mockUser as User,
      );

      expect(result).toEqual(mockUpdatedPost);
    });

    it('should throw ForbiddenException when user is not author nor ADMIN', async () => {
      const mockUser = { id: 2, role: Role.USER }; // Different user
      const mockPost = {
        id: postId,
        title: 'Original Post',
        description: 'Original Description',
        authorId: 1, // Different from user id
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost as any);

      await expect(
        postsService.update(postId, updatePostDto, mockUser as User),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        postsService.update(postId, updatePostDto, mockUser as User),
      ).rejects.toThrow('You can only update your own posts');
    });

    it('should throw NotFoundException if post not found', async () => {
      const mockUser = { id: 1, role: Role.USER };

      jest
        .spyOn(postsService, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Post with ID ${postId} not found`),
        );

      await expect(
        postsService.update(postId, updatePostDto, mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const postId = 1;

    it('should delete post successfully when user is author', async () => {
      const mockUser = { id: 1, role: Role.USER };
      const mockPost = {
        id: postId,
        title: 'Test Post',
        description: 'Test Description',
        authorId: 1, // Same as user id
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost as any);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await postsService.remove(postId, mockUser as User);

      expect(result).toEqual({ message: 'Post deleted successfully' });
      expect(postsService.findOne).toHaveBeenCalledWith(postId);
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      });
    });

    it('should delete post successfully when user is ADMIN', async () => {
      const mockUser = { id: 2, role: Role.ADMIN }; // Different user but ADMIN
      const mockPost = {
        id: postId,
        title: 'Test Post',
        description: 'Test Description',
        authorId: 1, // Different from user id
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost as any);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await postsService.remove(postId, mockUser as User);

      expect(result).toEqual({ message: 'Post deleted successfully' });
    });

    it('should throw ForbiddenException when user is not author nor ADMIN', async () => {
      const mockUser = { id: 2, role: Role.USER }; // Different user
      const mockPost = {
        id: postId,
        title: 'Test Post',
        description: 'Test Description',
        authorId: 1, // Different from user id
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost as any);

      await expect(
        postsService.remove(postId, mockUser as User),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        postsService.remove(postId, mockUser as User),
      ).rejects.toThrow('You can only delete your own posts');
    });
  });
});
