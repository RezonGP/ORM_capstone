import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class SavedService {
  constructor(private readonly prisma: PrismaService) { }


  findSavedByUser(userId: number) {
    return this.prisma.saved_images.findMany({
      where: {
        user_id: userId,
        deletedAt: null,
        image_id: {
          not: null,
        },
      },
      include: {
        image: true,
      },
    });
  }

  async saveImage(userId: number, imageId: number) {
    const image = await this.prisma.images.findFirst({
      where: { id: imageId, deletedAt: null },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const UserExist = await this.prisma.saved_images.findFirst({
      where: {
        user_id: userId,
        image_id: imageId,
        deletedAt: null,
      },
    });
    if (UserExist) {
      throw new BadRequestException('Image already saved');
    }

    return await this.prisma.saved_images.create({
      data: {
        user_id: userId,
        image_id: imageId,
      },
      include: {
        image: true,
      },
    });
  }

  async isSaved(userId: number, imageId: number) {
    const saved = await this.prisma.saved_images.findFirst({
      where: {
        user_id: userId,
        image_id: imageId,
        deletedAt: null,
      },
    });
    return saved ? true : false;
  }
}
