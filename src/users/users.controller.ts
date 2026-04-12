import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/token/AccessToken.token';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AccessTokenGuard)
  @Get(`me`)
  getMe(@Req() req: any) {
    return this.usersService.findOne(req.user.userId);
  }
}
