import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { LocalizedString } from '../../../common/types/i18n.types';
import { CustomFieldType } from '../enums/custom-field-type.enum';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({ _id: false })
export class LocalizedStringSchema {
  @Prop({ required: true, trim: true })
  zh!: string;

  @Prop({ required: true, trim: true })
  en!: string;
}

@Schema({ _id: false })
export class CustomFieldOption {
  @Prop({ type: LocalizedStringSchema, required: true })
  label!: LocalizedString;

  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema({ _id: false })
export class CustomField {
  @Prop({ type: LocalizedStringSchema, required: true })
  name!: LocalizedString;

  @Prop({ required: true, enum: Object.values(CustomFieldType) })
  type: CustomFieldType;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [CustomFieldOption], default: [] })
  options: CustomFieldOption[];
}

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ type: LocalizedStringSchema, required: true })
  name!: LocalizedString;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: LocalizedStringSchema, default: { zh: '', en: '' } })
  description!: LocalizedString;

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
