<<<<<<< HEAD
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
=======
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
<<<<<<< HEAD
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
=======
        ttl: 60,
        limit: 20,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    CloudinaryModule,
    AdminModule,
  ],
  controllers: [AppController],
<<<<<<< HEAD
  providers: [],
=======
  providers: [AppService],
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
})
export class AppModule {}
