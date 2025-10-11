import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/osint',
  cors: {
    origin: '*',
  },
})
export class OsintGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OsintGateway.name);
  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  @SubscribeMessage('subscribe_investigation')
  handleSubscribe(client: Socket, investigationId: string) {
    client.join(`investigation:${investigationId}`);
    this.logger.log(`Client ${client.id} subscribed to ${investigationId}`);
  }

  sendProgress(investigationId: string, data: any) {
    this.server.to(`investigation:${investigationId}`).emit('investigation_progress', {
      investigation_id: investigationId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }
}