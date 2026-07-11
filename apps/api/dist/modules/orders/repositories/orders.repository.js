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
exports.OrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../../database/database.constants");
const tenant_context_service_1 = require("../../tenants/tenant-context.service");
const ALLOWED_TRANSITIONS = {
    PENDING: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
};
let OrdersRepository = class OrdersRepository {
    pool;
    tenantContext;
    constructor(pool, tenantContext) {
        this.pool = pool;
        this.tenantContext = tenantContext;
    }
    async findAll1(status) {
        const [rows] = await this.pool.execute(`
        SELECT id, order_number, table_id, status, total, created_at, updated_at
        FROM orders
        ${status ? 'WHERE status = ?' : ''}
        ORDER BY created_at DESC
      `, status ? [status] : []);
        return rows;
    }
    async findAll2(status) {
        // 1. We check if there's a status filter provided
        const queryConditions = status
            ? 'WHERE DATE(created_at) = CURDATE() AND status = ?'
            : 'WHERE DATE(created_at) = CURDATE()';
        const [rows] = await this.pool.execute(`
      SELECT id, order_number, table_id, status, total, created_at, updated_at
      FROM orders
      ${queryConditions}
      ORDER BY created_at DESC
    `, status ? [status] : []);
        return rows;
    }
    async findAll(status) {
        const tenantId = this.tenantContext.requireId();
        // This approach allows MySQL to use an index on `created_at`
        const queryConditions = status
            ? 'WHERE tenant_id = ? AND created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY AND status = ?'
            : 'WHERE tenant_id = ? AND created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY';
        const [rows] = await this.pool.execute(`
      SELECT id, order_number, table_id, status, total, created_at, updated_at
      FROM orders
      ${queryConditions}
      ORDER BY created_at DESC
    `, status ? [tenantId, status] : [tenantId]);
        return rows;
    }
    async findById(id) {
        const tenantId = this.tenantContext.requireId();
        const [rows] = await this.pool.execute(`
        SELECT id, order_number, table_id, status, total, created_at, updated_at
        FROM orders
        WHERE id = ? AND tenant_id = ?
        LIMIT 1
      `, [id, tenantId]);
        return rows[0] ?? null;
    }
    async findItemsByOrderId(orderId) {
        const tenantId = this.tenantContext.requireId();
        const [rows] = await this.pool.execute(`
      SELECT
        oi.id,
        oi.order_id,
        oi.menu_item_id,
        mi.name,
        oi.quantity,
        oi.price,
        oi.notes,
        oi.created_at
      FROM order_items oi
      JOIN menu_items mi
        ON mi.id = oi.menu_item_id
      WHERE oi.order_id = ? AND EXISTS (SELECT 1 FROM orders o WHERE o.id = oi.order_id AND o.tenant_id = ?)
      ORDER BY oi.id ASC
    `, [orderId, tenantId]);
        return rows;
    }
    async resolveMenuItems(items) {
        const tenantId = this.tenantContext.requireId();
        if (items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const resolved = [];
        for (const item of items) {
            const [rows] = await this.pool.execute(`
          SELECT id, price, preparation_time
          FROM menu_items
          WHERE id = ? AND tenant_id = ? AND is_available = TRUE
          LIMIT 1
        `, [item.menuItemId, tenantId]);
            const menuItem = rows[0];
            if (!menuItem) {
                throw new common_1.BadRequestException(`Menu item ${item.menuItemId} is unavailable`);
            }
            resolved.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem.price,
                notes: item.notes ?? null,
                preparationTime: menuItem.preparation_time
            });
        }
        return resolved;
    }
    async createOrder(orderNumber, tableId, items) {
        const tenantId = this.tenantContext.requireId();
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const [tableRows] = await connection.execute(`
          SELECT id, status
          FROM \`tables\`
          WHERE id = ? AND tenant_id = ?
          LIMIT 1
        `, [tableId, tenantId]);
            const table = tableRows[0];
            if (!table) {
                throw new common_1.NotFoundException('Table not found');
            }
            if (table.status === 'DISABLED') {
                throw new common_1.BadRequestException('Table is not available for ordering');
            }
            const total = items
                .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
                .toFixed(2);
            const [insertResult] = await connection.execute(`
          INSERT INTO orders (tenant_id, order_number, table_id, status, total)
          VALUES (?, ?, ?, 'PENDING', ?)
        `, [tenantId, orderNumber, tableId, total]);
            const orderId = Number(insertResult.insertId);
            const itemInserts = items.map((item) => [
                orderId,
                item.menuItemId,
                item.quantity,
                item.price,
                item.notes
            ]);
            await connection.query(`
          INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes)
          VALUES ?
        `, [itemInserts]);
            await connection.execute(`
          UPDATE \`tables\`
          SET status = 'OCCUPIED'
          WHERE id = ? AND tenant_id = ?
        `, [tableId, tenantId]);
            await connection.commit();
            const created = await this.findById(orderId);
            if (!created) {
                throw new Error('Order creation failed');
            }
            return created;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async updateStatus(id, status) {
        const tenantId = this.tenantContext.requireId();
        const existing = await this.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Order not found');
        }
        const allowed = ALLOWED_TRANSITIONS[existing.status];
        if (!allowed.includes(status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${existing.status} to ${status}`);
        }
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute(`
          UPDATE orders
          SET status = ?
          WHERE id = ? AND tenant_id = ?
        `, [status, id, tenantId]);
            if (status === 'DELIVERED' || status === 'CANCELLED') {
                await connection.execute(`
            UPDATE \`tables\`
            SET status = 'AVAILABLE'
            WHERE id = ? AND tenant_id = ?
          `, [existing.table_id, tenantId]);
            }
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload order after status update');
        }
        return updated;
    }
    async estimatePrepTimeForOrder(orderId) {
        const tenantId = this.tenantContext.requireId();
        const [rows] = await this.pool.execute(`
        SELECT MAX(mi.preparation_time) AS max_time
        FROM order_items oi
        INNER JOIN menu_items mi ON mi.id = oi.menu_item_id
        WHERE oi.order_id = ? AND EXISTS (SELECT 1 FROM orders o WHERE o.id = oi.order_id AND o.tenant_id = ?)
      `, [orderId, tenantId]);
        return Number(rows[0]?.max_time ?? 0);
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object, tenant_context_service_1.TenantContextService])
], OrdersRepository);
