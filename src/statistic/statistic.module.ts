import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [UserModule, CategoryModule, OrderModule, ProductModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
