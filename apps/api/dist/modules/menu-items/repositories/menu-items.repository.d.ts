import type { Pool } from 'mysql2/promise';
import type { MenuItemRecord } from '../types/menu-item-record';
export declare class MenuItemsRepository {
    private readonly pool;
    constructor(pool: Pool);
    findAll(includeUnavailable?: boolean): Promise<MenuItemRecord[]>;
    findById(id: number, includeUnavailable?: boolean): Promise<MenuItemRecord | null>;
    create(data: {
        categoryId: number;
        name: string;
        description?: string;
        image?: string;
        price: string;
        preparationTime: number;
        isAvailable?: boolean;
    }): Promise<MenuItemRecord>;
    update(id: number, data: {
        categoryId?: number;
        name?: string;
        description?: string;
        image?: string;
        price?: string;
        preparationTime?: number;
        isAvailable?: boolean;
    }): Promise<MenuItemRecord>;
    delete(id: number): Promise<void>;
}
