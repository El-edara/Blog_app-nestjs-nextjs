import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let cloudinaryService: CloudinaryService;

  const mockUsersService = {
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 1 };
      const mockProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
      };

      mockUsersService.findOne.mockResolvedValue(mockProfile);

      const result = await usersController.getProfile(user);

      expect(result).toEqual(mockProfile);
      expect(usersService.findOne).toHaveBeenCalledWith(user.id);
    });
  });

  describe('updateProfile', () => {
    it('should update profile without file', async () => {
      const user = { id: 1 };
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const mockUpdatedUser = {
        id: 1,
        ...updateUserDto,
      };

      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const result = await usersController.updateProfile(
        user,
        null as any,
        updateUserDto,
      );

      expect(result).toEqual(mockUpdatedUser);
      expect(usersService.update).toHaveBeenCalledWith(user.id, updateUserDto);
      expect(cloudinaryService.uploadFile).not.toHaveBeenCalled();
    });

    it('should update profile with avatar file', async () => {
      const user = { id: 1 };
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'avatar.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const mockUploadResult = {
        secure_url: 'https://cloudinary.com/avatar.jpg',
      };

      const mockUpdatedUser = {
        id: 1,
        name: 'Updated Name',
        avatarUrl: 'https://cloudinary.com/avatar.jpg',
      };

      mockCloudinaryService.uploadFile.mockResolvedValue(mockUploadResult);
      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const result = await usersController.updateProfile(
        user,
        mockFile,
        updateUserDto,
      );

      expect(result).toEqual(mockUpdatedUser);
      expect(cloudinaryService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(usersService.update).toHaveBeenCalledWith(user.id, {
        ...updateUserDto,
        avatarUrl: 'https://cloudinary.com/avatar.jpg',
      });
    });
  });

  describe('admin endpoints', () => {
    describe('create', () => {
      it('should create a user (admin only)', async () => {
        const createUserDto: CreateUserDto = {
          name: 'New User',
          email: 'new@test.com',
          password: 'password123',
        };
        const mockUser = {
          id: 1,
          ...createUserDto,
          role: Role.USER,
        };

        mockUsersService.create.mockResolvedValue(mockUser);

        const result = await usersController.create(createUserDto);

        expect(result).toEqual(mockUser);
        expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      });
    });

    describe('findAll', () => {
      it('should return all users (admin only)', async () => {
        const mockUsers = [
          { id: 1, name: 'User 1', email: 'user1@test.com' },
          { id: 2, name: 'User 2', email: 'user2@test.com' },
        ];

        mockUsersService.findAll.mockResolvedValue(mockUsers);

        const result = await usersController.findAll();

        expect(result).toEqual(mockUsers);
        expect(usersService.findAll).toHaveBeenCalled();
      });
    });

    describe('findOne', () => {
      it('should return a user by id (admin only)', async () => {
        const userId = 1;
        const mockUser = {
          id: userId,
          name: 'Test User',
          email: 'test@test.com',
        };

        mockUsersService.findOne.mockResolvedValue(mockUser);

        const result = await usersController.findOne(userId);

        expect(result).toEqual(mockUser);
        expect(usersService.findOne).toHaveBeenCalledWith(userId);
      });
    });

    describe('update', () => {
      it('should update a user (admin only)', async () => {
        const userId = 1;
        const updateUserDto: UpdateUserDto = {
          name: 'Updated Name',
        };
        const mockUpdatedUser = {
          id: userId,
          ...updateUserDto,
        };

        mockUsersService.update.mockResolvedValue(mockUpdatedUser);

        const result = await usersController.update(userId, updateUserDto);

        expect(result).toEqual(mockUpdatedUser);
        expect(usersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      });
    });

    describe('remove', () => {
      it('should delete a user (admin only)', async () => {
        const userId = 1;
        const deleteResult = {
          message: `User with ID ${userId} has been deleted`,
        };

        mockUsersService.remove.mockResolvedValue(deleteResult);

        const result = await usersController.remove(userId);

        expect(result).toEqual(deleteResult);
        expect(usersService.remove).toHaveBeenCalledWith(userId);
      });
    });
  });

  describe('guards and roles', () => {
    it('should have JwtAuthGuard on all methods', () => {
      const methods = [
        'getProfile',
        'updateProfile',
        'create',
        'findAll',
        'findOne',
        'update',
        'remove',
      ];

      methods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          UsersController.prototype[method],
        );
        expect(guards).toBeDefined();
      });
    });

    it('should have RolesGuard and Roles decorator on admin methods', () => {
      const adminMethods = ['create', 'findAll', 'findOne', 'update', 'remove'];

      adminMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          UsersController.prototype[method],
        );
        const roles = Reflect.getMetadata(
          'roles',
          UsersController.prototype[method],
        );

        expect(guards.length).toBe(2); // JwtAuthGuard + RolesGuard
        expect(roles).toEqual([Role.ADMIN]);
      });
    });
  });
});
