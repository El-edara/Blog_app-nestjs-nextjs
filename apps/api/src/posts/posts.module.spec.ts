import { Test, TestingModule } from '@nestjs/testing';
import { PostsModule } from './posts.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('PostsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PostsModule, PrismaModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(PostsModule).toBeDefined();
  });

  it('should provide PostsController', () => {
    const controller = module.get<PostsController>(PostsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(PostsController);
  });

  it('should provide PostsService', () => {
    const service = module.get<PostsService>(PostsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PostsService);
  });
});
