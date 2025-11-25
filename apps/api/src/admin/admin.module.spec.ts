import { Test, TestingModule } from '@nestjs/testing';
import { AdminModule } from './admin.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(AdminModule).toBeDefined();
  });

  it('should provide AdminController', () => {
    const controller = module.get<AdminController>(AdminController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AdminController);
  });

  it('should provide AdminService', () => {
    const service = module.get<AdminService>(AdminService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AdminService);
  });
});
