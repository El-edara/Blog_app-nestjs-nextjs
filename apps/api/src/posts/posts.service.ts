import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: number) {
    return await this.prisma.post.create({
      data: {
        title: dto.title,
        description: dto.description,
        published: dto.published,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async findAll(query: FindAllPostsDto) {
    const { page = 1, limit = 10, search, published } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (published !== undefined) {
      where.published = published;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: {
          select: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    return post;
  }

  async findMyPosts(userId: number) {
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { comments: true } },
      },
    });

    return posts;
  }

  async update(id: number, dto: UpdatePostDto, user: User) {
    const post = await this.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.authorId !== user.id && user.role !== 'ADMIN')
      throw new ForbiddenException('You can only update your own posts');

    return this.prisma.post.update({
      where: { id },
      data: dto,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number, user: User) {
    const post = await this.findOne(id);

    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted successfully' };
  }
}
