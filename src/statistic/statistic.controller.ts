import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('category')
  async getCategoryStatistics() {
    return this.statisticService.getCategoriesStatistic();
  }

  @Get('order')
  async getOrderStatistics() {
    return this.statisticService.getOrdersStatistic();
  }

  @Get('product')
  async getProductStatistics() {
    return this.statisticService.getProductsStatistic();
  }

  @Get('user-order')
  async getUserOrdersStatistics() {
    return this.statisticService.getUserOrderStatistic();
  }
}
