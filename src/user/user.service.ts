import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async createUser(dto: userDto) {
    await this.checkUser(dto.email);
    const user = new this.user(dto);

    await user.save();
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.user.findById(userId).select('-password');
    return user;
  }

  async getUser(email: string) {
    const user = await this.user.findOne({ email });
    if (!user) {
      throw new BadRequestException(`User with email ${email} is not defined`);
    }
    return user;
  }

  async getOrders(userId: string) {
    const orders = await this.user.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'orders',
          localField: 'orders',
          foreignField: '_id',
          as: 'orders',
        },
      },
      { $unwind: '$orders' },
      {
        $project: {
          _id: 0,
          'orders._id': 1,
          'orders.totalPrice': 1,
          'orders.address': 1,
          'orders.createdAt': 1,
          'orders.status': 1,
        },
      },
    ]);

    return orders || null;
  }

  async checkUser(email: string) {
    const user = await this.user.findOne({ email });
    if (user) {
      throw new BadRequestException(`User with email ${email} already exist`);
    }

    return true;
  }

  async updateUserWithOrder(userId: any, orderId: string, del: boolean) {
    if (del) {
      await this.user.findByIdAndUpdate(
        userId,
        {
          $pull: { orders: orderId },
          $inc: { orderCount: -1 },
        },
        { new: true },
      );
    }

    await this.user.findByIdAndUpdate(
      userId,
      {
        $push: { orders: orderId },
        $inc: { orderCount: +1 },
      },
      { new: true },
    );
  }

  async getOrderStatistic() {
    // const res = await this.
    // const statistics = await this.user.aggregate([
    // {
    // $lookup: {
    // from: 'orders',
    // localField: '_id',
    // foreignField: 'user',
    // as: 'orders',
    // },
    // },
    // {
    // $addFields: {
    // totalOrders: { $size: '$orders' },
    // totalSpent: { $sum: '$orders.totalPrice' },
    // },
    // },
    // {
    // $sort: { totalOrders: -1 },
    // },
    // {
    // $project: {
    // _id: 1,
    // totalOrders: 1,
    // totalSpent: 1,
    // },
    // },
    // ]);
    // return statistics;
  }

  async validateUser(id: string) {
    const user = await this.user.findById(id);
    if (!user) {
      throw new BadRequestException(`User not valid`);
    }
    return user;
  }
}
