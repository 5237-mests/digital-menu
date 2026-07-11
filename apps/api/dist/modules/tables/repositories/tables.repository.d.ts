import type { Pool } from 'mysql2/promise';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { TableRecord } from '../types/table-record';
export declare class TablesRepository {
    private readonly pool;
    private readonly tenantContext;
    constructor(pool: Pool, tenantContext: TenantContextService);
    findAll(): Promise<TableRecord[]>;
    findByQrCode(qrCode: string): Promise<TableRecord | null>;
    updateStatus(id: number, status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED'): Promise<void>;
    findById(id: number): Promise<TableRecord | null>;
    create(data: {
        tableNumber: number;
        qrCode: string;
        status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableRecord>;
    update(id: number, data: {
        tableNumber?: number;
        qrCode?: string;
        status?: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableRecord>;
    delete(id: number): Promise<void>;
}
