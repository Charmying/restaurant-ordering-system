import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CustomFieldType } from '../enums/custom-field-type.enum';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({ _id: false })
export class CustomFieldOption {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema({ _id: false })
export class CustomField {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Object.values(CustomFieldType) })
  type: CustomFieldType;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [CustomFieldOption], default: [] })
  options: CustomFieldOption[];
}

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  category: string[];

  @Prop({ default: 0 })
  categoryOrder: number;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: [CustomField], default: [] })
  customFields: CustomField[];

  @Prop({ default: true })
  available: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });
MenuItemSchema.index({ categoryOrder: 1 });
