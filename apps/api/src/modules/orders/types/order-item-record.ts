import type { RowDataPacket } from 'mysql2';

export interface OrderItemRecord extends RowDataPacket {
    readonly id: number;
    readonly order_id: number;
    readonly menu_item_id: number;
    readonly item_name: string;
    readonly quantity: number;
    readonly price: string;
    readonly notes: string | null;
    readonly created_at: string;
}

export interface OrderItemDto {
    readonly id: number;
    readonly orderId: number;
    readonly menuItemId: number;
    readonly item_name: string;
    readonly quantity: number;
    readonly price: string;
    readonly notes: string | null;
    readonly createdAt: string;
}

export function toOrderItemDto(record: OrderItemRecord): OrderItemDto {
    return {
        id: record.id,
        orderId: record.order_id,
        menuItemId: record.menu_item_id,
        item_name: record.name,
        quantity: record.quantity,
        price: record.price,
        notes: record.notes,
        createdAt: record.created_at
    };
}
