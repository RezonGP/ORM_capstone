import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';
import { tokenModule } from 'src/modules-system/prisma/token.module';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';

@Module({
  imports: [PrismaModule, tokenModule],
  controllers: [CommentsController],
  providers: [CommentsService, AccessTokenGuard],
})
export class CommentsModule { }
