import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';
import { tokenModule } from 'src/modules-system/prisma/token.module';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';

@Module({
  controllers: [SavedController],
  providers: [SavedService, AccessTokenGuard],
  imports: [PrismaModule, tokenModule],
})
export class SavedModule { }
