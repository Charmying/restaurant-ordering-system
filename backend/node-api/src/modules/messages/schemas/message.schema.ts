import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) username: string;
  @Prop({ required: true, trim: true }) content: string;
  @Prop({ default: false }) isPinned: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ isPinned: -1, createdAt: -1 });
