import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class LocationTrackingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('locationUpdate')
  handleLocation(
    @MessageBody()
    data: {
      orderId: string;
      coords: any;
    },
  ) {
    this.server.emit(`order-${data.orderId}`, data.coords);
  }
}
