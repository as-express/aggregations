import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://expressaset:1234@asetsila.6ld82.mongodb.net/Aggregations-Nest?retryWrites=true&w=majority&appName=AsetSila',
    ),
    UserModule,
    CategoryModule,
    AuthModule,
    ProductModule,
    OrderModule,
    StatisticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
