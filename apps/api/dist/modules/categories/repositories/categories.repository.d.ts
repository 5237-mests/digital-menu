import type { Pool } from 'mysql2/promise';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { CategoryRecord } from '../types/category-record';
export declare class CategoriesRepository {
    private readonly pool;
    private readonly tenantContext;
    constructor(pool: Pool, tenantContext: TenantContextService);
    findAll(includeInactive?: boolean): Promise<CategoryRecord[]>;
    findById(id: number, includeInactive?: boolean): Promise<CategoryRecord | null>;
    create(data: {
        name: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryRecord>;
    update(id: number, data: {
        name?: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryRecord>;
    delete(id: number): Promise<void>;
}
