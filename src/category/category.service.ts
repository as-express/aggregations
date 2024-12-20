import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { categoryDto } from './dto/category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private category: Model<Category>) {}

  async create(dto: categoryDto) {
    const category = new this.category(dto);
    await category.save();

    return category;
  }

  async findAll() {
    const categories = await this.category.find({}, '-products').lean();
    return categories;
  }

  async findOne(id: string) {
    const category = await this.category.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'products',
        },
      },
    ]);
    return category[0] || null;
  }

  async updateCategoryWithProduct(
    categoryId: any,
    productId: string,
    del: boolean,
  ) {
    if (del) {
      await this.category.findByIdAndUpdate(
        categoryId,
        {
          $pull: { products: productId },
          $inc: { productsCount: -1 },
        },
        { new: true },
      );
    }

    await this.category.findByIdAndUpdate(
      categoryId,
      {
        $push: { products: productId },
        $inc: { productsCount: +1 },
      },
      { new: true },
    );
  }

  async update(id: string, dto: categoryDto) {
    await this.category.findByIdAndUpdate(
      id,
      {
        title: dto.title,
      },
      { new: true },
    );
    return 'Category Updated Success';
  }

  async remove(id: string) {
    await this.category.findByIdAndDelete(id);
    return 'Category Deleted Success';
  }

  async getStatistic() {
    const statistics = await this.category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'products',
        },
      },
      {
        $unwind: {
          path: '$products',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          totalSales: { $sum: '$products.sales' },
        },
      },
      {
        $sort: {
          totalSales: -1,
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          totalSales: 1,
        },
      },
    ]);
    return statistics;
  }

  async checkCategory(id: string) {
    const category = await this.category.findById(id);
    if (!category) {
      throw new NotFoundException(`Category not found with id ${id}`);
    }

    return category;
  }
}
