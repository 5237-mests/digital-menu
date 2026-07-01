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

export function toOrderDto(record: OrderRecord): OrderDto {
    return {
        id: record.id,
        orderNumber: record.order_number,
        tableId: record.table_id,
        status: record.status,
        total: record.total,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
