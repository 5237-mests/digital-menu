"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
let DashboardService = class DashboardService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async getStats() {
        const [rows] = await this.pool.query(`
        SELECT
          SUM(status = 'PENDING') AS pending,
          SUM(status = 'PREPARING') AS preparing,
          SUM(status = 'READY') AS ready,
          SUM(status = 'DELIVERED') AS delivered,
          SUM(status = 'CANCELLED') AS cancelled,
          COALESCE(SUM(total), 0.00) AS total
        FROM orders
      `);
        const counts = rows[0] ?? {
            pending: 0,
            preparing: 0,
            ready: 0,
            delivered: 0,
            cancelled: 0,
            total: '0.00'
        };
        return {
            totalOrders: counts.pending + counts.preparing + counts.ready + counts.delivered + counts.cancelled,
            pendingOrders: counts.pending,
            preparingOrders: counts.preparing,
            readyOrders: counts.ready,
            deliveredOrders: counts.delivered,
            cancelledOrders: counts.cancelled,
            totalSales: counts.total
        };
    }
    async getSales() {
        const [rows] = await this.pool.query(`
        SELECT
          DATE(created_at) AS date,
          COALESCE(SUM(total), 0.00) AS total,
          COUNT(*) AS orders
        FROM orders
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 30
      `);
        const salesRows = rows;
        return salesRows.map((row) => ({
            date: row.date,
            totalSales: row.total,
            orders: row.orders
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], DashboardService);
