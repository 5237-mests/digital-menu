import type { Pool, RowDataPacket } from 'mysql2/promise';
export interface TenantRecord extends RowDataPacket {
    id: number;
    name: string;
    slug: string;
    status: string;
    grace_ends_at: Date | null;
}
export declare class TenantsService {
    private readonly pool;
    constructor(pool: Pool);
    findBySlug(slug: string): Promise<TenantRecord | null>;
    findAll(): Promise<TenantRecord[]>;
    create(name: string, slug: string): Promise<TenantRecord>;
    findById(id: number): Promise<TenantRecord | null>;
    setStatus(id: number, status: string): Promise<TenantRecord>;
}
