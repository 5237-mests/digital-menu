export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
