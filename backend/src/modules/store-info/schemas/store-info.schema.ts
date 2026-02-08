import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoreInfoDocument = HydratedDocument<StoreInfo>;

@Schema({ timestamps: true })
export class StoreInfo {
  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ required: true, trim: true })
  value: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: false })
  isStoreName: boolean;

  @Prop({ default: true })
  isDeletable: boolean;
}

export const StoreInfoSchema = SchemaFactory.createForClass(StoreInfo);

StoreInfoSchema.index({ order: 1 });

StoreInfoSchema.index(
  { isStoreName: 1 },
  {
    unique: true,
    partialFilterExpression: { isStoreName: true },
  },
);
