import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { tokenModule } from 'src/modules-system/prisma/token.module';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, AccessTokenGuard],
  imports: [tokenModule, PrismaModule],
})
export class ImagesModule { }
