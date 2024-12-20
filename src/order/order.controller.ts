import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { orderDto } from './dto/order.dto';
import { userDecorator } from 'common/decorator/user.decorator';
import { statusDto } from './dto/status.dto';
import { Auth } from 'common/guard/jwt.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Auth()
  async createOrder(@userDecorator('id') id: string, @Body() dto: orderDto) {
    return this.orderService.create(id, dto);
  }

  @Put(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  async orderStatus(@Param('id') id: string, @Body() dto: statusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Auth()
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
