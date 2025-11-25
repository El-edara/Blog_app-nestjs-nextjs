import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('CloudinaryController', () => {
  let cloudinaryController: CloudinaryController;
  let cloudinaryService: CloudinaryService;

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudinaryController],
      providers: [
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    cloudinaryController =
      module.get<CloudinaryController>(CloudinaryController);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadResult = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
        public_id: 'test',
      };

      mockCloudinaryService.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await cloudinaryController.uploadImage(mockFile);

      expect(result).toEqual({
        message: 'File uploaded successfully',
        url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
      });
      expect(cloudinaryService.uploadFile).toHaveBeenCalledWith(mockFile);
    });

    it('should handle upload error', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockError = new Error('Upload failed');
      mockCloudinaryService.uploadFile.mockRejectedValue(mockError);

      await expect(cloudinaryController.uploadImage(mockFile)).rejects.toThrow(
        'Upload failed',
      );
    });

    it('should use JWT auth guard', () => {
      // The guard is applied via decorator, so we just verify the controller has the guard
      const guards = Reflect.getMetadata(
        '__guards__',
        CloudinaryController.prototype.uploadImage,
      );
      expect(guards).toBeDefined();
    });
  });

  describe('controller configuration', () => {
    it('should be defined', () => {
      expect(cloudinaryController).toBeDefined();
    });

    it('should have upload endpoint protected with JwtAuthGuard', () => {
      // Check if the guard is applied to the controller method
      const guards = Reflect.getMetadata(
        '__guards__',
        CloudinaryController.prototype.uploadImage,
      );
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });
  });
});
