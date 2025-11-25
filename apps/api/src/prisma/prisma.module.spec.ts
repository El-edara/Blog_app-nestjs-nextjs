import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaModule', () => {
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(PrismaModule).toBeDefined();
  });

  it('should provide PrismaService', () => {
    expect(prismaService).toBeDefined();
  });

  it('should have PrismaService methods', () => {
    expect(prismaService.$connect).toBeDefined();
    expect(prismaService.$disconnect).toBeDefined();
    expect(prismaService.onModuleInit).toBeDefined();
    expect(prismaService.onModuleDestroy).toBeDefined();
  });

  it('should initialize and destroy correctly', async () => {
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockResolvedValue();
    const disconnectSpy = jest
      .spyOn(prismaService, '$disconnect')
      .mockResolvedValue();

    await prismaService.onModuleInit();
    await prismaService.onModuleDestroy();

    expect(connectSpy).toHaveBeenCalled();
    expect(disconnectSpy).toHaveBeenCalled();

    connectSpy.mockRestore();
    disconnectSpy.mockRestore();
  });
});
