import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
<<<<<<< HEAD
import { HttpExceptionsFilter } from './common/filters/HttpExceptionFilter';
=======
import { AllExceptionsFilter } from './common/HttpExceptionFilter';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
<<<<<<< HEAD
  app.useGlobalFilters(new HttpExceptionsFilter());
=======
  app.useGlobalFilters(new AllExceptionsFilter());
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(helmet());
  app.use(cookieParser());
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 API is running on http://localhost:${port}`);
}
void bootstrap();
