import type { OrderItemDto } from './order-item-record';
import type { OrderDto } from './order-record';
export interface OrderDetailResponse {
    readonly order: OrderDto;
    readonly items: OrderItemDto[];
    readonly estimatedPrepTime: number;
}
