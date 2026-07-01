import type { RowDataPacket } from 'mysql2';
export interface TableRecord extends RowDataPacket {
    readonly id: number;
    readonly table_number: number;
    readonly qr_code: string;
    readonly status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    readonly created_at: string;
    readonly updated_at: string;
}
export interface TableDto {
    readonly id: number;
    readonly tableNumber: number;
    readonly qrCode: string;
    readonly status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    readonly createdAt: string;
    readonly updatedAt: string;
}
export declare function toTableDto(record: TableRecord): TableDto;
