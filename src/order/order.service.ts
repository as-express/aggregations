import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { orderDto } from './dto/order.dto';
import { statusDto } from './dto/status.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private order: Model<Order>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async create(id: string, dto: orderDto) {
    const cash = await Promise.all(
      dto.products.map(async (item) => {
        const product = await this.productService.updateProducts(
          item.product,
          item.quantity,
        );
        console.log(product.price);

        console.log(product);
        return item.quantity * product.price;
      }),
    );

    console.log(cash);
    const totalPrice = cash.reduce((a, b) => Number(a) + Number(b), 0);
    const order = new this.order({
      user: id,
      products: dto.products,
      totalPrice,
      status: 'pending',
      address: dto.address,
      createdAt: new Date(),
    });
    await order.save();

    await this.userService.updateUserWithOrder(id, order.id, false);
    return order;
  }

  async updateStatus(id: string, dto: statusDto) {
    await this.order.findByIdAndUpdate(
      id,
      {
        status: dto.status,
      },
      { new: true },
    );

    return 'Order updated success';
  }

  async getStatistics() {
    const statistics = await this.order.aggregate([
      {
        $group: {
          _id: '$address',
          totalOrders: { $sum: 1 },
          totalCash: { $sum: '$totalPrice' },
          maxCash: { $max: '$totalPrice' },
          avgCash: { $avg: '$totalPrice' },
          minCash: { $min: '$totalPrice' },
        },
      },
      {
        $sort: { totalOrders: -1 },
      },
      {
        $project: {
          totalOrders: 1,
          totalCash: 1,
          maxCash: 1,
          avgCash: 1,
          minCash: 1,
        },
      },
    ]);
    return statistics;
  }

  async remove(id: string) {
    const order = await this.order.findById(id);
    await this.userService.updateUserWithOrder(order.user, order.id, true);

    await this.order.findByIdAndDelete(id);
    return 'Order Deleted success';
  }
}
