import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { userDecorator } from 'common/decorator/user.decorator';
import { Auth } from 'common/guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@userDecorator('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Get('orders')
  @Auth()
  async getOrders(@userDecorator('id') id: string) {
    return this.userService.getOrders(id);
  }
}
