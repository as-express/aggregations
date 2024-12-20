import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { Product } from 'src/product/schema/product.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    @InjectModel(Category.name) private category: Model<Category>,
    @InjectModel(Product.name) private product: Model<Product>,
  ) {}

  async seed() {}

  async usersSeed() {
    try {
    } catch (err) {
      throw new InternalServerErrorException('SErver Error');
    }
  }
}
