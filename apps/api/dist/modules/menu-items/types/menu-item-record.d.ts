import type { RowDataPacket } from 'mysql2';
export interface MenuItemRecord extends RowDataPacket {
    readonly id: number;
    readonly category_id: number;
    readonly name: string;
    readonly description: string | null;
    readonly image: string | null;
    readonly price: string;
    readonly preparation_time: number;
    readonly is_available: number;
    readonly created_at: string;
    readonly updated_at: string;
}
export interface MenuItemDto {
    readonly id: number;
    readonly categoryId: number;
    readonly name: string;
    readonly description: string | null;
    readonly image: string | null;
    readonly price: string;
    readonly preparationTime: number;
    readonly isAvailable: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}
export declare function toMenuItemDto(record: MenuItemRecord): MenuItemDto;
