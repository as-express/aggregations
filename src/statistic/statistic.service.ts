import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { OrderService } from 'src/order/order.service';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private categorySErvice: CategoryService,
  ) {}

  async getUserStatistic() {}

  async getUserOrderStatistic() {
    const result = await this.userService.getOrderStatistic();
    console.log(result);
    return result;
  }

  async getOrdersStatistic() {
    const result = await this.orderService.getStatistics();
    return result;
  }

  async getCategoriesStatistic() {
    const result = await this.categorySErvice.getStatistic();
    return result;
  }

  async getProductsStatistic() {
    const result = await this.productService.getStatistics();
    return result;
  }
}
