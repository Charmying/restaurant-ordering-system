import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ServiceCallStatus } from '../enums/service-call-status.enum';

export type ServiceCallDocument = HydratedDocument<ServiceCall>;

@Schema({ timestamps: true })
export class ServiceCall {
  @Prop({ required: true })
  tableNumber: number;

  @Prop({ type: String, enum: Object.values(ServiceCallStatus), default: ServiceCallStatus.Pending })
  status: ServiceCallStatus;

  @Prop()
  handledAt?: Date;
}

export const ServiceCallSchema = SchemaFactory.createForClass(ServiceCall);

ServiceCallSchema.index({ status: 1, createdAt: 1 });

ServiceCallSchema.index(
  { tableNumber: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: ServiceCallStatus.Pending } },
);
