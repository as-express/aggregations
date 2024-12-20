import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/product/schema/product.schema';

@Schema()
export class Category {
  @Prop()
  title: string;

  @Prop()
  productsCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];
}

export const categorySchema = SchemaFactory.createForClass(Category);
