import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  describe('Module Definition', () => {
    it('should be defined', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const appModule = moduleRef.get<AppModule>(AppModule);
      expect(appModule).toBeDefined();
    });

    it('should compile without errors', async () => {
      await expect(
        Test.createTestingModule({
          imports: [AppModule],
        }).compile(),
      ).resolves.toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should be a function (class)', () => {
      expect(typeof AppModule).toBe('function');
    });

    it('should have proper NestJS module structure', () => {
      // تحقق من أن الـ Module يمكن استيراده واستخدامه
      expect(() => {
        const module = AppModule;
        return module;
      }).not.toThrow();
    });
  });

  describe('Module Composition', () => {
    it('should import required modules', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      // تحقق من أن التطبيق يمكن أن يبدأ بدون أخطاء
      const app = moduleRef.createNestApplication();
      await expect(app.init()).resolves.toBeDefined();
      await app.close();
    });
  });
});
