import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { LocalizedString } from '../../../common/types/i18n.types';

export type StoreInfoDocument = HydratedDocument<StoreInfo>;

@Schema({ _id: false })
export class LocalizedStringSchema {
  @Prop({ required: true, trim: true })
  zh!: string;

  @Prop({ required: true, trim: true })
  en!: string;
}

@Schema({ timestamps: true })
export class StoreInfo {
  @Prop({ type: LocalizedStringSchema, required: true })
  label!: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  value!: LocalizedString;

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
