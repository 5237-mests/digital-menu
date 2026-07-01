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

export function toTableDto(record: TableRecord): TableDto {
    return {
        id: record.id,
        tableNumber: record.table_number,
        qrCode: record.qr_code,
        status: record.status,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
