import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<import("./types/dashboard-stats").DashboardStatsDto>;
    getSales(): Promise<import("./types/dashboard-stats").DashboardSalesDto[]>;
}
