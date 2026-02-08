import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TableStatus } from '../enums/table-status.enum';

export type TableDocument = HydratedDocument<Table>;

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true, unique: true })
  tableNumber: number;

  @Prop({ enum: TableStatus, default: TableStatus.Available })
  status: TableStatus;

  @Prop({ default: '' })
  qrCodeUrl: string;

  @Prop({ default: '' })
  qrCodeToken: string;

  @Prop({ default: '' })
  qrCodeImage: string;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }], default: [] })
  orderItems: Types.ObjectId[];
}

export const TableSchema = SchemaFactory.createForClass(Table);
TableSchema.index({ status: 1 });
TableSchema.index({ tableNumber: 1 });
