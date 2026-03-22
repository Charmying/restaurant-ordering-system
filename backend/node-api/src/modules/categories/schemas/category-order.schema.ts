import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryOrderDocument = HydratedDocument<CategoryOrder>;

@Schema({ timestamps: true })
export class CategoryOrder {
  @Prop({ type: [String], required: true, default: [] })
  categories: string[];
}

export const CategoryOrderSchema = SchemaFactory.createForClass(CategoryOrder);
