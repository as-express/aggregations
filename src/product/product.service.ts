import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { productDto } from './dto/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private product: Model<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: productDto) {
    await this.categoryService.checkCategory(dto.categoryId);
    const product = new this.product({
      title: dto.title,
      color: dto.color,
      price: dto.price,
      quantity: dto.quantity,
      desc: dto.desc,
      categoryId: dto.categoryId,
    });
    await product.save();

    await this.categoryService.updateCategoryWithProduct(
      dto.categoryId,
      product.id,
      false,
    );

    return product;
  }

  async findAll() {
    const products = await this.product
      .find({}, 'title price quantity sales')
      .lean();
    return products;
  }

  async findOne(id: string) {
    const product = await this.product.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
      // throw new BadRequestException();
    }

    return product;
  }

  async updateProducts(id: string, quantity: number) {
    const product = await this.product.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    if (product.quantity < quantity) {
      throw new BadRequestException(`Have only ${product.quantity} Products`);
    }

    product.sales += quantity;
    product.quantity -= quantity;
    await product.save();

    return product;
  }

  async update(id: string, dto: productDto) {
    await this.product.findByIdAndUpdate(id, dto);
    return 'Product updated success';
  }

  async getStatistics() {
    const result = await this.product.aggregate([
      {
        $group: {
          _id: '$_id',
          totalSales: { $sum: '$sales' },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          salesPrice: 1,
        },
      },
    ]);
    return result;
  }

  async remove(id: string) {
    const product = await this.product.findById(id);
    await this.categoryService.updateCategoryWithProduct(
      product.categoryId,
      product.id,
      true,
    );
    await this.product.findByIdAndDelete(id);
    return 'Product deleted success';
  }
}
