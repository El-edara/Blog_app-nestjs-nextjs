import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentDto, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.comment.create({
      data: {
        description: dto.description,
        authorId: userId,
        postId: dto.postId,
      },
      include: {
        author: { select: { id: true, email: true, name: true } },
        post: { select: { id: true, title: true } },
      },
    });
  }

  async findAll(postId?: number) {
    const where = postId ? { postId } : {};

    return await this.prisma.comment.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        post: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        post: { select: { id: true, title: true } },
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: number, dto: UpdateCommentDto, user: User) {
    const comment = await this.findOne(id);

    if (comment.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: dto,
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: number, user: User) {
    const comment = await this.findOne(id);

    if (comment.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Comment deleted successfully' };
  }
}
