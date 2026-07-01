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
const ALLOWED_TRANSITIONS = {
    PENDING: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
};
let OrdersRepository = class OrdersRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll(status) {
        const [rows] = await this.pool.execute(`
        SELECT id, order_number, table_id, status, total, created_at, updated_at
        FROM orders
        ${status ? 'WHERE status = ?' : ''}
        ORDER BY created_at DESC
      `, status ? [status] : []);
        return rows;
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`
        SELECT id, order_number, table_id, status, total, created_at, updated_at
        FROM orders
        WHERE id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async findItemsByOrderId2(orderId) {
        const [rows] = await this.pool.execute(`
        SELECT id, order_id, menu_item_id, menu_items.name, quantity, price, notes, created_at
        FROM order_items
        JOIN menu_items ON menu_items.id = order_items.menu_item_id
        WHERE order_id = ?
        ORDER BY id ASC
      `, [orderId]);
        return rows;
    }
    async findItemsByOrderId(orderId) {
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
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC
    `, [orderId]);
        return rows;
    }
    async resolveMenuItems(items) {
        if (items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const resolved = [];
        for (const item of items) {
            const [rows] = await this.pool.execute(`
          SELECT id, price, preparation_time
          FROM menu_items
          WHERE id = ? AND is_available = TRUE
          LIMIT 1
        `, [item.menuItemId]);
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
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const [tableRows] = await connection.execute(`
          SELECT id, status
          FROM \`tables\`
          WHERE id = ?
          LIMIT 1
        `, [tableId]);
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
          INSERT INTO orders (order_number, table_id, status, total)
          VALUES (?, ?, 'PENDING', ?)
        `, [orderNumber, tableId, total]);
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
          WHERE id = ?
        `, [tableId]);
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
          WHERE id = ?
        `, [status, id]);
            if (status === 'DELIVERED' || status === 'CANCELLED') {
                await connection.execute(`
            UPDATE \`tables\`
            SET status = 'AVAILABLE'
            WHERE id = ?
          `, [existing.table_id]);
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
        const [rows] = await this.pool.execute(`
        SELECT MAX(mi.preparation_time) AS max_time
        FROM order_items oi
        INNER JOIN menu_items mi ON mi.id = oi.menu_item_id
        WHERE oi.order_id = ?
      `, [orderId]);
        return Number(rows[0]?.max_time ?? 0);
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], OrdersRepository);
