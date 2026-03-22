import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(private readonly gateway: EventsGateway) {}

  emit(event: string, payload: unknown) {
    this.gateway.emit(event, payload);
  }
}
