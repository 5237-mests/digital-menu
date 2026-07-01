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
export declare function toOrderItemDto(record: OrderItemRecord): OrderItemDto;
