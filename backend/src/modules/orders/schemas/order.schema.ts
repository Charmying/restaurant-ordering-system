import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ type: Object })
  customization?: Record<string, unknown>;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  tableNumber: number;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Prop({ required: true })
  token: string;

  @Prop()
  completedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ tableNumber: 1, status: 1 });
OrderSchema.index({ token: 1 });
