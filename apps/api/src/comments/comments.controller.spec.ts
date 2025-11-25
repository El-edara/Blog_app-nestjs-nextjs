import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User, Role } from '@prisma/client';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        description: 'Test comment',
        postId: 1,
      };
      const user = { id: 1 };
      const mockComment = {
        id: 1,
        ...createCommentDto,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCommentsService.create.mockResolvedValue(mockComment);

      const result = await commentsController.create(createCommentDto, user);

      expect(result).toEqual(mockComment);
      expect(commentsService.create).toHaveBeenCalledWith(
        createCommentDto,
        user.id,
      );
    });
  });

  describe('findAll', () => {
    it('should return all comments when no postId', async () => {
      const mockComments = [
        { id: 1, description: 'Comment 1' },
        { id: 2, description: 'Comment 2' },
      ];

      mockCommentsService.findAll.mockResolvedValue(mockComments);

      const result = await commentsController.findAll();

      expect(result).toEqual(mockComments);
      expect(commentsService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return comments for specific post when postId provided', async () => {
      const postId = '1';
      const mockComments = [{ id: 1, description: 'Comment 1', postId: 1 }];

      mockCommentsService.findAll.mockResolvedValue(mockComments);

      const result = await commentsController.findAll(postId);

      expect(result).toEqual(mockComments);
      expect(commentsService.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const commentId = 1;
      const mockComment = {
        id: commentId,
        description: 'Test comment',
      };

      mockCommentsService.findOne.mockResolvedValue(mockComment);

      const result = await commentsController.findOne(commentId);

      expect(result).toEqual(mockComment);
      expect(commentsService.findOne).toHaveBeenCalledWith(commentId);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = {
        description: 'Updated comment',
      };
      const user = { id: 1, role: Role.USER } as User;
      const mockUpdatedComment = {
        id: commentId,
        ...updateCommentDto,
        author: { id: user.id, name: 'Test User' },
      };

      mockCommentsService.update.mockResolvedValue(mockUpdatedComment);

      const result = await commentsController.update(
        commentId,
        updateCommentDto,
        user,
      );

      expect(result).toEqual(mockUpdatedComment);
      expect(commentsService.update).toHaveBeenCalledWith(
        commentId,
        updateCommentDto,
        user,
      );
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      const commentId = 1;
      const user = { id: 1, role: Role.USER } as User;
      const deleteResult = { message: 'Comment deleted successfully' };

      mockCommentsService.remove.mockResolvedValue(deleteResult);

      const result = await commentsController.remove(commentId, user);

      expect(result).toEqual(deleteResult);
      expect(commentsService.remove).toHaveBeenCalledWith(commentId, user);
    });
  });

  describe('guards', () => {
    it('should have JwtAuthGuard on create, update, and delete methods', () => {
      const createGuards = Reflect.getMetadata(
        '__guards__',
        CommentsController.prototype.create,
      );
      const updateGuards = Reflect.getMetadata(
        '__guards__',
        CommentsController.prototype.update,
      );
      const deleteGuards = Reflect.getMetadata(
        '__guards__',
        CommentsController.prototype.remove,
      );

      expect(createGuards).toBeDefined();
      expect(updateGuards).toBeDefined();
      expect(deleteGuards).toBeDefined();
    });

    it('should not have JwtAuthGuard on find methods', () => {
      const findAllGuards = Reflect.getMetadata(
        '__guards__',
        CommentsController.prototype.findAll,
      );
      const findOneGuards = Reflect.getMetadata(
        '__guards__',
        CommentsController.prototype.findOne,
      );

      expect(findAllGuards).toBeUndefined();
      expect(findOneGuards).toBeUndefined();
    });
  });
});
