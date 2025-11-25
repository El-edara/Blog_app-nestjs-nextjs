import { Test, TestingModule } from '@nestjs/testing';
import { CommentsModule } from './comments.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('CommentsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CommentsModule, PrismaModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(CommentsModule).toBeDefined();
  });

  it('should provide CommentsController', () => {
    const controller = module.get<CommentsController>(CommentsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(CommentsController);
  });

  it('should provide CommentsService', () => {
    const service = module.get<CommentsService>(CommentsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(CommentsService);
  });
});
