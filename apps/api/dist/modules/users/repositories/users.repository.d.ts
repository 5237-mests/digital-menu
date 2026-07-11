import type { Pool } from 'mysql2/promise';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { UserRecord, UserRole } from '../types/user-record';
export declare class UsersRepository {
    private readonly pool;
    private readonly tenantContext;
    constructor(pool: Pool, tenantContext: TenantContextService);
    findAll(): Promise<UserRecord[]>;
    findByEmail(email: string): Promise<UserRecord | null>;
    findById(id: number): Promise<UserRecord | null>;
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
        role: UserRole;
        tenantId?: number | null;
    }): Promise<UserRecord>;
    update(id: number, data: {
        name?: string;
        email?: string;
        passwordHash?: string;
        role?: UserRole;
    }): Promise<UserRecord>;
    delete(id: number): Promise<void>;
}
