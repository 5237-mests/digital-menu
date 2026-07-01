import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';
import type { OrderDetailResponse } from '../orders/types/order-detail-response';

const REALTIME_EVENTS = {
  orderCreated: 'order.created',
  orderUpdated: 'order.updated',
  orderDelivered: 'order.delivered',
  kitchenQueueUpdated: 'kitchen.queue.updated'
} as const;

@Injectable()
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true
  }
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  emitOrderCreated(payload: OrderDetailResponse): void {
    this.server.emit(REALTIME_EVENTS.orderCreated, payload);
    this.server.emit(REALTIME_EVENTS.kitchenQueueUpdated);
  }

  emitOrderUpdated(payload: OrderDetailResponse): void {
    this.server.emit(REALTIME_EVENTS.orderUpdated, payload);
    this.server.emit(REALTIME_EVENTS.kitchenQueueUpdated);

    if (payload.order.status === 'DELIVERED') {
      this.server.emit(REALTIME_EVENTS.orderDelivered, payload);
    }
  }
}
