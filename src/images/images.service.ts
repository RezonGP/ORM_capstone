import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) { }
  findCreatedByUser(userId: number) {
    return this.prisma.images.findMany({
      where: { user_id: userId, deletedAt: null },
    });
  }
  createForUser(userId: number, dto: CreateImageDto) {
    return this.prisma.images.create({
      data: {
        user_id: userId,
        url: dto.url,
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async deleteCreatedImage(userId: number, imageId: number) {
    const image = await this.prisma.images.findFirst({
      where: { id: imageId, deletedAt: null },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    if (image.user_id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this image');
    }

    await this.prisma.images.update({
      where: { id: imageId },
      data: { deletedAt: new Date() },
    });

    return true;
  }
  findAll() {
    return this.prisma.images.findMany({
      where: { deletedAt: null },
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

  searchByName(name: string) {
    if (!name) {
      throw new BadRequestException('Missing query param: name');
    }
    return this.prisma.images.findMany({
      where: {
        deletedAt: null,
        name: { contains: name },
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

  async findOne(id: number) {
    const image = await this.prisma.images.findFirst({
      where: { id, deletedAt: null },
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
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }
}
