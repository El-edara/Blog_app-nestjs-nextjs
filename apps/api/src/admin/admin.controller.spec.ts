import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    getStats: jest.fn(),
    getRecentActivity: jest.fn(),
    getAllUsers: jest.fn(),
    changeUserRole: jest.fn(),
    deleteUser: jest.fn(),
    getAllPosts: jest.fn(),
    deletePost: jest.fn(),
    togglePostPublish: jest.fn(),
    getAllComments: jest.fn(),
    deleteComment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return stats', async () => {
      const stats = {
        totalUsers: 10,
        totalPosts: 20,
        totalComments: 30,
        publishedPosts: 15,
        draftPosts: 5,
      };
      mockAdminService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
      expect(adminService.getStats).toHaveBeenCalled();
    });
  });

  describe('getRecentActivity', () => {
    it('should return recent activity', async () => {
      const recentActivity = {
        recentUsers: [{ id: 1, name: 'User1' }],
        recentPosts: [{ id: 1, title: 'Post1' }],
        recentComments: [{ id: 1, description: 'Comment1' }],
      };
      mockAdminService.getRecentActivity.mockResolvedValue(recentActivity);

      const result = await controller.getRecentActivity();

      expect(result).toEqual(recentActivity);
      expect(adminService.getRecentActivity).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, name: 'User1', email: 'user1@test.com', role: Role.USER },
      ];
      mockAdminService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(result).toEqual(users);
      expect(adminService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const userId = 1;
      const role = Role.ADMIN;
      const updatedUser = { id: userId, name: 'User1', role };

      mockAdminService.changeUserRole.mockResolvedValue(updatedUser);

      const result = await controller.updateUserRole(userId, role);

      expect(result).toEqual(updatedUser);
      expect(adminService.changeUserRole).toHaveBeenCalledWith(userId, role);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = 1;
      const deleteResult = { message: 'User deleted successfully' };

      mockAdminService.deleteUser.mockResolvedValue(deleteResult);

      const result = await controller.deleteUser(userId);

      expect(result).toEqual(deleteResult);
      expect(adminService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const posts = [{ id: 1, title: 'Post1', published: true }];
      mockAdminService.getAllPosts.mockResolvedValue(posts);

      const result = await controller.getAllPosts();

      expect(result).toEqual(posts);
      expect(adminService.getAllPosts).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      const postId = 1;
      const deleteResult = { message: 'Post deleted successfully' };

      mockAdminService.deletePost.mockResolvedValue(deleteResult);

      const result = await controller.deletePost(postId);

      expect(result).toEqual(deleteResult);
      expect(adminService.deletePost).toHaveBeenCalledWith(postId);
    });
  });

  describe('togglePostPublish', () => {
    it('should toggle post publish status', async () => {
      const postId = 1;
      const published = true;
      const updatedPost = { id: postId, title: 'Post1', published };

      mockAdminService.togglePostPublish.mockResolvedValue(updatedPost);

      const result = await controller.togglePostPublish(postId, published);

      expect(result).toEqual(updatedPost);
      expect(adminService.togglePostPublish).toHaveBeenCalledWith(
        postId,
        published,
      );
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const comments = [{ id: 1, description: 'Comment1' }];
      mockAdminService.getAllComments.mockResolvedValue(comments);

      const result = await controller.getAllComments();

      expect(result).toEqual(comments);
      expect(adminService.getAllComments).toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      const commentId = 1;
      const deleteResult = { message: 'Comment deleted successfully' };

      mockAdminService.deleteComment.mockResolvedValue(deleteResult);

      const result = await controller.deleteComment(commentId);

      expect(result).toEqual(deleteResult);
      expect(adminService.deleteComment).toHaveBeenCalledWith(commentId);
    });
  });
});
