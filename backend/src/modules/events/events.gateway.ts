import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/events',
  cors: { origin: true },
})
export class EventsGateway {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('WebSocket Events Gateway initialized');
  }

  handleConnection(client: { id: string }) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: { id: string }) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emit(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }
}
