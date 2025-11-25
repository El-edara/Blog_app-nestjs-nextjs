import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { User, Role } from '@prisma/client';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findMyPosts: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        description: 'Test Description',
        published: true,
      };
      const user = { id: 1 };
      const mockPost = {
        id: 1,
        ...createPostDto,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPostsService.create.mockResolvedValue(mockPost);

      const result = await postsController.create(createPostDto, user);

      expect(result).toEqual(mockPost);
      expect(postsService.create).toHaveBeenCalledWith(createPostDto, user.id);
    });
  });

  describe('findAll', () => {
    it('should return all posts with query parameters', async () => {
      const query: FindAllPostsDto = {
        page: 1,
        limit: 10,
        search: 'test',
        published: true,
      };
      const mockResult = {
        data: [
          {
            id: 1,
            title: 'Test Post',
            description: 'Test Description',
            published: true,
            author: { id: 1, email: 'test@test.com', name: 'Test User' },
            _count: { comments: 5 },
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockPostsService.findAll.mockResolvedValue(mockResult);

      const result = await postsController.findAll(query);

      expect(result).toEqual(mockResult);
      expect(postsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getMyPosts', () => {
    it('should return current user posts', async () => {
      const user = { id: 1 };
      const mockPosts = [
        {
          id: 1,
          title: 'My Post',
          description: 'My Description',
          published: true,
          authorId: user.id,
          _count: { comments: 2 },
        },
      ];

      mockPostsService.findMyPosts.mockResolvedValue(mockPosts);

      const result = await postsController.getMyPosts(user);

      expect(result).toEqual(mockPosts);
      expect(postsService.findMyPosts).toHaveBeenCalledWith(user.id);
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
        comments: [],
      };

      mockPostsService.findOne.mockResolvedValue(mockPost);

      const result = await postsController.findOne(postId);

      expect(result).toEqual(mockPost);
      expect(postsService.findOne).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        description: 'Updated Description',
      };
      const user = { id: 1, role: Role.USER } as User;
      const mockUpdatedPost = {
        id: postId,
        ...updatePostDto,
        author: { id: user.id, email: 'test@test.com', name: 'Test User' },
      };

      mockPostsService.update.mockResolvedValue(mockUpdatedPost);

      const result = await postsController.update(postId, updatePostDto, user);

      expect(result).toEqual(mockUpdatedPost);
      expect(postsService.update).toHaveBeenCalledWith(
        postId,
        updatePostDto,
        user,
      );
    });
  });

  describe('remove', () => {
    it('should delete a post (admin only)', async () => {
      const postId = 1;
      const user = { id: 1, role: Role.ADMIN } as User;
      const deleteResult = { message: 'Post deleted successfully' };

      mockPostsService.remove.mockResolvedValue(deleteResult);

      const result = await postsController.remove(postId, user);

      expect(result).toEqual(deleteResult);
      expect(postsService.remove).toHaveBeenCalledWith(postId, user);
    });
  });

  describe('guards and roles', () => {
    it('should have JwtAuthGuard on protected methods', () => {
      const protectedMethods = ['create', 'getMyPosts', 'update', 'remove'];

      protectedMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          PostsController.prototype[method],
        );
        expect(guards).toBeDefined();
      });
    });

    it('should not have JwtAuthGuard on public methods', () => {
      const publicMethods = ['findAll', 'findOne'];

      publicMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          PostsController.prototype[method],
        );
        expect(guards).toBeUndefined();
      });
    });

    it('should have RolesGuard and Roles decorator only on delete method', () => {
      const deleteMethod = 'remove';
      const roles = Reflect.getMetadata(
        'roles',
        PostsController.prototype[deleteMethod],
      );
      const guards = Reflect.getMetadata(
        '__guards__',
        PostsController.prototype[deleteMethod],
      );

      expect(roles).toEqual([Role.ADMIN]);
      expect(guards).toBeDefined();
    });
  });
});
