import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LocationTrackingService } from './location-tracking.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/location-tracking',
})
export class LocationTrackingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(LocationTrackingGateway.name);
  private readonly activeConnections = new Map<string, Socket>();
  private readonly entitySubscriptions = new Map<string, Set<string>>(); // entityId -> Set of socketIds
  private readonly orderSubscriptions = new Map<string, Set<string>>(); // orderId -> Set of socketIds

  constructor(
    private readonly locationTrackingService: LocationTrackingService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(): void {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    this.activeConnections.set(client.id, client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeConnections.delete(client.id);

    // Clean up subscriptions for this client
    this.entitySubscriptions.forEach((clients, entityId) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.entitySubscriptions.delete(entityId);
      }
    });

    this.orderSubscriptions.forEach((clients, orderId) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.orderSubscriptions.delete(orderId);
      }
    });
  }

  @SubscribeMessage('track-location')
  handleLocationUpdate(@MessageBody() data: any): void {
    // Placeholder for location tracking
    this.server.emit('location-update', data);
  }
}
