import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('image/:imageId')
  findByImageId(@Param('imageId') imageId: string) {
    return this.commentsService.findByImageId(+imageId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.createForUser(req.user.userId, createCommentDto);
  }
}
