import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';
import type { Socket } from 'socket.io';
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

  @SubscribeMessage('tenant.join')
  joinTenant(@ConnectedSocket() socket: Socket, tenantId: number): void { socket.join(`tenant:${tenantId}`); }

  emitOrderCreated(tenantId: number, payload: OrderDetailResponse): void {
    this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.orderCreated, payload);
    this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.kitchenQueueUpdated);
  }

  emitOrderUpdated(tenantId: number, payload: OrderDetailResponse): void {
    this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.orderUpdated, payload);
    this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.kitchenQueueUpdated);

    if (payload.order.status === 'DELIVERED') {
      this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.orderDelivered, payload);
    }
  }
}
