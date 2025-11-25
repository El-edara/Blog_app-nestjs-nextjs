import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryModule } from './cloudinary.module';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CloudinaryModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(CloudinaryModule).toBeDefined();
  });

  it('should provide CloudinaryController', () => {
    const controller = module.get<CloudinaryController>(CloudinaryController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(CloudinaryController);
  });

  it('should provide CloudinaryService', () => {
    const service = module.get<CloudinaryService>(CloudinaryService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(CloudinaryService);
  });
});
