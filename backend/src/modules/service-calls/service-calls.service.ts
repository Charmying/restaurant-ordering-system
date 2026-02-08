import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceCall, ServiceCallDocument } from './schemas/service-call.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateServiceCallDto } from './dto/create-service-call.dto';
import { ServiceCallStatus } from './enums/service-call-status.enum';

@Injectable()
export class ServiceCallsService {
  constructor(
    @InjectModel(ServiceCall.name)
    private readonly model: Model<ServiceCallDocument>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateServiceCallDto) {
    const call = await this.model.findOneAndUpdate(
      {
        tableNumber: dto.tableNumber,
        status: ServiceCallStatus.Pending,
      },
      {
        $setOnInsert: {
          tableNumber: dto.tableNumber,
          status: ServiceCallStatus.Pending,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    this.eventsGateway.emit('serviceCall', call);
    return call;
  }

  findPending() {
    return this.model.find({ status: ServiceCallStatus.Pending }).sort({ createdAt: 1 });
  }

  async handle(id: string) {
    const call = await this.model.findOneAndUpdate(
      { _id: id, status: ServiceCallStatus.Pending },
      {
        status: ServiceCallStatus.Handled,
        handledAt: new Date(),
      },
      { new: true },
    );

    if (!call) throw new NotFoundException('Service call not found or already handled');
    this.eventsGateway.emit('serviceCallHandled', call);
    return call;
  }
}
