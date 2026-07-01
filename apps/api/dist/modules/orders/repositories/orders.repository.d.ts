import type { Pool } from 'mysql2/promise';
import type { OrderItemRecord } from '../types/order-item-record';
import type { OrderRecord, OrderStatus } from '../types/order-record';
export interface NewOrderItemInput {
    readonly menuItemId: number;
    readonly quantity: number;
    readonly notes?: string | null;
}
export interface ResolvedOrderItem {
    readonly menuItemId: number;
    readonly quantity: number;
    readonly price: string;
    readonly notes: string | null;
    readonly preparationTime: number;
}
export declare class OrdersRepository {
    private readonly pool;
    constructor(pool: Pool);
    findAll(status?: OrderStatus): Promise<OrderRecord[]>;
    findById(id: number): Promise<OrderRecord | null>;
    findItemsByOrderId2(orderId: number): Promise<OrderItemRecord[]>;
    findItemsByOrderId(orderId: number): Promise<OrderItemRecord[]>;
    resolveMenuItems(items: NewOrderItemInput[]): Promise<ResolvedOrderItem[]>;
    createOrder(orderNumber: string, tableId: number, items: ResolvedOrderItem[]): Promise<OrderRecord>;
    updateStatus(id: number, status: OrderStatus): Promise<OrderRecord>;
    estimatePrepTimeForOrder(orderId: number): Promise<number>;
}
