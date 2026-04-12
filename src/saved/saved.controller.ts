import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SavedService } from './saved.service';
import { CreateSavedDto } from './dto/create-saved.dto';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';

@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }
  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMySaved(@Req() req: any) {
    const userId = req.user.userId;
    return this.savedService.findSavedByUser(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('check/:imageId')
  checkSaved(@Req() req: any, @Param('imageId') imageId: string) {
    return this.savedService.isSaved(req.user.userId, +imageId);
  }


  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Req() req: any, @Body() createSavedDto: CreateSavedDto) {
    return this.savedService.saveImage(req.user.userId, createSavedDto.imageId);
  }
}
