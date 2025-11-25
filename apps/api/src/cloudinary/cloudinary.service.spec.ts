import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let cloudinaryService: CloudinaryService;

  const mockCloudinary = {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Set environment variables for testing
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test-file-content'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadResult: Partial<UploadApiResponse> = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
        public_id: 'test',
        version: 1,
        signature: 'test-signature',
        width: 100,
        height: 100,
        format: 'jpg',
        resource_type: 'image',
        created_at: '2023-01-01',
        tags: [],
        bytes: 1024,
        type: 'upload',
        etag: 'test-etag',
        placeholder: false,
        url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
        access_mode: 'public',
        original_filename: 'test',
      };

      // Mock the upload_stream to call the callback with success
      const mockUploadStream = {
        on: jest.fn().mockReturnThis(),
        end: jest.fn(),
        write: jest.fn(),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockUploadResult);
          return mockUploadStream;
        },
      );

      const result = await cloudinaryService.uploadFile(mockFile);

      expect(result).toEqual(mockUploadResult);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { folder: 'user_avatars', resource_type: 'auto' },
        expect.any(Function),
      );
    });

    it('should handle upload error', async () => {
      const mockFile = {
        buffer: Buffer.from('test-file-content'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockError: UploadApiErrorResponse = {
        message: 'Upload failed',
        name: 'UploadError',
        http_code: 400,
      };

      // Mock the upload_stream to call the callback with error
      const mockUploadStream = {
        on: jest.fn().mockReturnThis(),
        end: jest.fn(),
        write: jest.fn(),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(mockError, null);
          return mockUploadStream;
        },
      );

      await expect(cloudinaryService.uploadFile(mockFile)).rejects.toEqual(
        mockError,
      );
    });

    it('should use correct cloudinary configuration', () => {
      // Test that cloudinary was configured correctly in constructor
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret',
      });
    });
  });

  describe('constructor', () => {
    it('should configure cloudinary with environment variables', () => {
      // The configuration happens in the constructor, so we just need to verify it was called
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret',
      });
    });

    it('should handle missing environment variables', async () => {
      // Clear environment variables
      delete process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.CLOUDINARY_API_KEY;
      delete process.env.CLOUDINARY_API_SECRET;

      // Recreate the service to trigger constructor again
      const module: TestingModule = await Test.createTestingModule({
        providers: [CloudinaryService],
      }).compile();

      const service = module.get<CloudinaryService>(CloudinaryService);

      // Should still call config but with undefined values
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: undefined,
        api_key: undefined,
        api_secret: undefined,
      });
    });
  });
});
