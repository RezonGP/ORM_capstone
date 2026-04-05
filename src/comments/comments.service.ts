import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async createForUser(userId: number, createCommentDto: CreateCommentDto) {
    const image = await this.prisma.images.findFirst({
      where: { id: createCommentDto.imageId, deletedAt: null },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const content = String(createCommentDto.content ?? '').trim();
    if (!content) {
      throw new BadRequestException('content is required');
    }

    return await this.prisma.comments.create({
      data: {
        user_id: userId,
        image_id: createCommentDto.imageId,
        content: content,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
      },
    });
  }

  findByImageId(imageId: number) {
    return this.prisma.comments.findMany({
      where: {
        image_id: imageId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }
}
