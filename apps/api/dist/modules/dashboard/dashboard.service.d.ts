import type { DashboardSalesDto, DashboardStatsDto } from './types/dashboard-stats';
import type { Pool } from 'mysql2/promise';
export declare class DashboardService {
    private readonly pool;
    constructor(pool: Pool);
    getStats(): Promise<DashboardStatsDto>;
    getSales(): Promise<DashboardSalesDto[]>;
}
