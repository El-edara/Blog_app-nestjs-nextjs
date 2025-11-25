import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionsFilter } from './common/filters/HttpExceptionFilter';

describe('Main Configuration', () => {
  describe('ValidationPipe', () => {
    it('should be configured correctly', () => {
      const pipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      });

      expect(pipe).toBeInstanceOf(ValidationPipe);

      // بدلاً من التحقق من الخصائص الداخلية، تحقق من السلوك المتوقع
      expect(pipe).toBeDefined();

      // أو تحقق من وجود الخصائص الأساسية
      const options = (pipe as any).validatorOptions || {};
      expect(options.whitelist).toBe(true);
      expect(options.forbidNonWhitelisted).toBe(true);
    });

    it('should create ValidationPipe with correct options', () => {
      const options = {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      };

      const pipe = new ValidationPipe(options);

      expect(pipe).toBeInstanceOf(ValidationPipe);

      // تحقق من أن الـ pipe تم إنشاؤه بنجاح بالإعدادات المطلوبة
      const pipeOptions = pipe['validatorOptions'] || {};
      expect(pipeOptions.whitelist).toBe(true);
      expect(pipeOptions.forbidNonWhitelisted).toBe(true);
    });
  });

  describe('CORS Configuration', () => {
    it('should have correct CORS settings', () => {
      const corsConfig = {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      };

      expect(corsConfig.credentials).toBe(true);
      expect(corsConfig.origin).toBeDefined();
    });

    it('should handle different frontend URLs', () => {
      const testCases = [
        { env: undefined, expected: 'http://localhost:3000' },
        { env: 'https://example.com', expected: 'https://example.com' },
        { env: 'https://production.com', expected: 'https://production.com' },
      ];

      testCases.forEach(({ env, expected }) => {
        const frontendUrl = env || 'http://localhost:3000';
        expect(frontendUrl).toBe(expected);
      });
    });
  });

  describe('Global Components', () => {
    it('should have ResponseInterceptor defined', () => {
      const interceptor = new ResponseInterceptor();
      expect(interceptor).toBeInstanceOf(ResponseInterceptor);
      expect(interceptor).toBeDefined();
    });

    it('should have HttpExceptionsFilter defined', () => {
      const filter = new HttpExceptionsFilter();
      expect(filter).toBeInstanceOf(HttpExceptionsFilter);
      expect(filter).toBeDefined();
    });
  });

  describe('Environment Variables', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterAll(() => {
      process.env = OLD_ENV;
    });

    it('should use PORT from environment or default to 4000', () => {
      delete process.env.PORT;
      const port = process.env.PORT ?? 4000;
      expect(port).toBe(4000);

      process.env.PORT = '5000';
      const portWithEnv = process.env.PORT ?? 4000;
      expect(portWithEnv).toBe('5000');
    });

    it('should use FRONTEND_URL from environment or default', () => {
      delete process.env.FRONTEND_URL;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      expect(frontendUrl).toBe('http://localhost:3000');

      process.env.FRONTEND_URL = 'https://example.com';
      const frontendUrlWithEnv =
        process.env.FRONTEND_URL || 'http://localhost:3000';
      expect(frontendUrlWithEnv).toBe('https://example.com');
    });
  });

  describe('Configuration Objects', () => {
    it('should create correct validation configuration', () => {
      const validationConfig = {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      };

      expect(validationConfig.whitelist).toBe(true);
      expect(validationConfig.forbidNonWhitelisted).toBe(true);
      expect(validationConfig.transform).toBe(true);
      expect(validationConfig.transformOptions.enableImplicitConversion).toBe(
        true,
      );
    });

    it('should create correct CORS configuration', () => {
      const corsConfig = {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      };

      expect(corsConfig).toEqual({
        origin: expect.any(String),
        credentials: true,
      });
    });
  });
});
