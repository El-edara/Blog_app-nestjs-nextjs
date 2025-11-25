import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionsFilter } from './common/filters/HttpExceptionFilter';

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
  app.useGlobalFilters(new HttpExceptionsFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(helmet());
  app.use(cookieParser());
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 API is running on http://localhost:${port}`);
}
void bootstrap();
