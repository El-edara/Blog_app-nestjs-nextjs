import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
<<<<<<< HEAD
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorators';
=======
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== STATS ==========
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.adminService.getRecentActivity();
  }
  // ========== USERS ==========
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role,
  ) {
    return this.adminService.changeUserRole(id, role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  // ========== POSTS ==========
  @Get('posts')
  async getAllPosts() {
    return this.adminService.getAllPosts();
  }

  @Delete('posts/:id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deletePost(id);
  }

  @Patch('posts/:id/publish')
  async togglePostPublish(
    @Param('id', ParseIntPipe) id: number,
    @Body('published') published: boolean,
  ) {
    return this.adminService.togglePostPublish(id, published);
  }

  // ========== COMMENTS ==========
  @Get('comments')
  async getAllComments() {
    return this.adminService.getAllComments();
  }

  @Delete('comments/:id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteComment(id);
  }
}
