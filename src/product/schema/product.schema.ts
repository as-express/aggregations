import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/category/schema/category.schema';

@Schema()
export class Product {
  @Prop()
  title: string;

  @Prop()
  color: string[];

  @Prop({ default: 0 })
  sales: number;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  categoryId: Category;

  @Prop()
  desc: string;
}

export const productSchema = SchemaFactory.createForClass(Product);
