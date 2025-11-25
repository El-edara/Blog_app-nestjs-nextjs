import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      const connectSpy = jest
        .spyOn(prismaService, '$connect')
        .mockResolvedValue(undefined);

      await prismaService.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);

      connectSpy.mockRestore();
    });

    it('should handle connection errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const connectSpy = jest
        .spyOn(prismaService, '$connect')
        .mockRejectedValue(new Error('Connection failed'));

      await prismaService.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Failed to connect to database',
        expect.any(Error),
      );

      connectSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect', async () => {
      const disconnectSpy = jest
        .spyOn(prismaService, '$disconnect')
        .mockResolvedValue(undefined);

      await prismaService.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);

      disconnectSpy.mockRestore();
    });
  });

  describe('PrismaClient inheritance', () => {
    it('should have PrismaClient methods', () => {
      expect(prismaService.$connect).toBeDefined();
      expect(prismaService.$disconnect).toBeDefined();
      expect(typeof prismaService.$connect).toBe('function');
      expect(typeof prismaService.$disconnect).toBe('function');
    });
  });
});
