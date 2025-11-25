import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
<<<<<<< HEAD
import { Roles } from '../common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
=======
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ✅ USER endpoints
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: { id: number }) {
    return this.usersService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @CurrentUser() user: { id: number },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ) {
    let avatarUrl: string | undefined = dto.avatarUrl;

    if (file) {
      const uploaded = await this.cloudinaryService.uploadFile(file);
      avatarUrl = uploaded.secure_url;
    }

    return this.usersService.update(user.id, { ...dto, avatarUrl });
  }

  // ✅ ADMIN endpoints فقط
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
<<<<<<< HEAD
  @UseGuards(JwtAuthGuard, RolesGuard)
=======
  @UseGuards(JwtAuthGuard)
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
