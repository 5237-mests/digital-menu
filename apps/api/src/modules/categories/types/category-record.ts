import type { RowDataPacket } from 'mysql2';

export interface CategoryRecord extends RowDataPacket {
    readonly id: number;
    readonly name: string;
    readonly image: string | null;
    readonly is_active: number;
    readonly sort_order: number;
    readonly created_at: string;
    readonly updated_at: string;
}

export interface CategoryDto {
    readonly id: number;
    readonly name: string;
    readonly image: string | null;
    readonly isActive: boolean;
    readonly sortOrder: number;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export function toCategoryDto(record: CategoryRecord): CategoryDto {
    return {
        id: record.id,
        name: record.name,
        image: record.image,
        isActive: Boolean(record.is_active),
        sortOrder: record.sort_order,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
