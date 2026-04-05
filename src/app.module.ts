import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { CommentsModule } from './comments/comments.module';
import { SavedModule } from './saved/saved.module';

@Module({
  imports: [AuthModule, UsersModule, ImagesModule, CommentsModule, SavedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
