import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

enum Status {
  pending = 'pending',
  delivered = 'delivered',
  canceled = 'canceled',
}

@Schema()
export class Order {
  @Prop({
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  })
  products: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop()
  totalPrice: number;

  @Prop()
  address: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ enum: Status, default: Status.pending })
  status: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);
