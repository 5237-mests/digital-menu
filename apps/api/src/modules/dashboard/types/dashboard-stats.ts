export interface DashboardStatsDto {
    readonly totalOrders: number;
    readonly pendingOrders: number;
    readonly preparingOrders: number;
    readonly readyOrders: number;
    readonly deliveredOrders: number;
    readonly cancelledOrders: number;
    readonly totalSales: string;
}

export interface DashboardSalesDto {
    readonly date: string;
    readonly totalSales: string;
    readonly orders: number;
}
