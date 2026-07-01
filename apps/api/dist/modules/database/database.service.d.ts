import { OnModuleDestroy } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
export interface DatabaseHealth {
    readonly status: 'ok';
}
export declare class DatabaseService implements OnModuleDestroy {
    private readonly pool;
    constructor(pool: Pool);
    getPool(): Pool;
    ping(): Promise<DatabaseHealth>;
    onModuleDestroy(): Promise<void>;
}
