import { Injectable } from '@nestjs/common';
import type { DashboardSalesDto, DashboardStatsDto } from './types/dashboard-stats';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { Inject } from '@nestjs/common';
import { MYSQL_POOL } from '../database/database.constants';

@Injectable()
export class DashboardService {
    constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) { }

    async getStats(): Promise<DashboardStatsDto> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `
        SELECT
          SUM(status = 'PENDING') AS pending,
          SUM(status = 'PREPARING') AS preparing,
          SUM(status = 'READY') AS ready,
          SUM(status = 'DELIVERED') AS delivered,
          SUM(status = 'CANCELLED') AS cancelled,
          COALESCE(SUM(total), 0.00) AS total
        FROM orders
      `
        );

        const counts = (rows[0] as { pending: number; preparing: number; ready: number; delivered: number; cancelled: number; total: string } | undefined) ?? {
            pending: 0,
            preparing: 0,
            ready: 0,
            delivered: 0,
            cancelled: 0,
            total: '0.00'
        };

        return {
            totalOrders:
                counts.pending + counts.preparing + counts.ready + counts.delivered + counts.cancelled,
            pendingOrders: counts.pending,
            preparingOrders: counts.preparing,
            readyOrders: counts.ready,
            deliveredOrders: counts.delivered,
            cancelledOrders: counts.cancelled,
            totalSales: counts.total
        };
    }

    async getSales(): Promise<DashboardSalesDto[]> {
        const [rows] = await this.pool.query<RowDataPacket[]>(
            `
        SELECT
          DATE(created_at) AS date,
          COALESCE(SUM(total), 0.00) AS total,
          COUNT(*) AS orders
        FROM orders
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 30
      `
        );

        const salesRows = rows as Array<{ date: string; total: string; orders: number }>;
        return salesRows.map((row) => ({
            date: row.date,
            totalSales: row.total,
            orders: row.orders
        }));
    }
}
