import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
<<<<<<< HEAD
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
=======
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    return {
      message: 'File uploaded successfully',
      url: result.secure_url,
    };
  }
}
