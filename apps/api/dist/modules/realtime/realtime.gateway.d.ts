import type { Server } from 'socket.io';
import type { OrderDetailResponse } from '../orders/types/order-detail-response';
export declare class RealtimeGateway {
    server: Server;
    emitOrderCreated(payload: OrderDetailResponse): void;
    emitOrderUpdated(payload: OrderDetailResponse): void;
}
