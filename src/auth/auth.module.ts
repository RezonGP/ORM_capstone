import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { tokenModule } from 'src/modules-system/prisma/token.module';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [tokenModule, PrismaModule],
})
export class AuthModule { }
