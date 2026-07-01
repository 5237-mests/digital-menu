export type UserRole = 'ADMIN' | 'CHEF';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export interface ApiHealth {
    readonly status: 'ok';
    readonly service: string;
}
