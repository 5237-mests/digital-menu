import type { RowDataPacket } from 'mysql2';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export interface OrderRecord extends RowDataPacket {
    readonly id: number;
    readonly order_number: string;
    readonly table_id: number;
    readonly status: OrderStatus;
    readonly total: string;
    readonly created_at: string;
    readonly updated_at: string;
}
export interface OrderDto {
    readonly id: number;
    readonly orderNumber: string;
    readonly tableId: number;
    readonly status: OrderStatus;
    readonly total: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}
export declare function toOrderDto(record: OrderRecord): OrderDto;
