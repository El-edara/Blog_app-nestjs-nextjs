import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
<<<<<<< HEAD
import { CloudinaryService } from '../cloudinary/cloudinary.service';
=======
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47

@Module({
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
