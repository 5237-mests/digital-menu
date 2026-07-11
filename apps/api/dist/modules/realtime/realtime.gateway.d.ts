import type { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import type { OrderDetailResponse } from '../orders/types/order-detail-response';
export declare class RealtimeGateway {
    server: Server;
    joinTenant(socket: Socket, tenantId: number): void;
    emitOrderCreated(tenantId: number, payload: OrderDetailResponse): void;
    emitOrderUpdated(tenantId: number, payload: OrderDetailResponse): void;
}
