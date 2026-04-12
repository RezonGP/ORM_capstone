import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @UseGuards(AccessTokenGuard)
  @Get('created')
  getCreated(@Req() req: any) {
    const userId = req.user.userId;
    return this.imagesService.findCreatedByUser(userId);
  }
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateImageDto) {
    return this.imagesService.createForUser(req.user.userId, dto);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.imagesService.searchByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Req() req: any, @Param('id') id: string) {
    return this.imagesService.deleteCreatedImage(req.user.userId, +id);
  }
}
