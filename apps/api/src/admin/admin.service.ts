import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ========== STATS ==========
  async getStats() {
    const [totalUsers, totalPosts, totalComments, publishedPosts] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.post.count(),
        this.prisma.comment.count(),
        this.prisma.post.count({ where: { published: true } }),
      ]);

    return {
      totalUsers,
      totalPosts,
      totalComments,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
    };
  }

  async getRecentActivity() {
    const [recentUsers, recentPosts, recentComments] = await Promise.all([
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          description: true,
          createdAt: true,
          author: {
            select: { id: true, name: true },
          },
          post: {
            select: { id: true, title: true },
          },
        },
      }),
    ]);

    return {
      recentUsers,
      recentPosts,
      recentComments,
    };
  }
  // ========== USERS ==========
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Delete user (cascades to posts and comments via Prisma schema)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async changeUserRole(userId: number, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  // ========== POSTS ==========
  async getAllPosts() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async deletePost(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post deleted successfully' };
  }

  async togglePostPublish(id: number, published: boolean) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return await this.prisma.post.update({
      where: { id },
      data: { published },
      select: {
        id: true,
        title: true,
        published: true,
      },
    });
  }

  // ========== COMMENTS ==========
  async getAllComments() {
    return this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }
}
