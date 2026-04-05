import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';
import { tokenModule } from 'src/modules-system/prisma/token.module';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';

@Module({
  imports: [PrismaModule, tokenModule],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenGuard],
})
export class UsersModule { }
