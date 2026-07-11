import type { Pool } from 'mysql2/promise';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { MenuItemRecord } from '../types/menu-item-record';
export declare class MenuItemsRepository {
    private readonly pool;
    private readonly tenantContext;
    constructor(pool: Pool, tenantContext: TenantContextService);
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
