import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import type { Pool, PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';
import type { OrderItemRecord } from '../types/order-item-record';
import type { OrderRecord, OrderStatus } from '../types/order-record';

export interface NewOrderItemInput {
  readonly menuItemId: number;
  readonly quantity: number;
  readonly notes?: string | null;
}

export interface ResolvedOrderItem {
  readonly menuItemId: number;
  readonly quantity: number;
  readonly price: string;
  readonly notes: string | null;
  readonly preparationTime: number;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: []
};

@Injectable()
export class OrdersRepository {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) { }

  async findAll(status?: OrderStatus): Promise<OrderRecord[]> {
    const [rows] = await this.pool.execute<OrderRecord[]>(
      `
        SELECT id, order_number, table_id, status, total, created_at, updated_at
        FROM orders
        ${status ? 'WHERE status = ?' : ''}
        ORDER BY created_at DESC
      `,
      status ? [status] : []
    );

    return rows;
  }

  async findById(id: number): Promise<OrderRecord | null> {
    const [rows] = await this.pool.execute<OrderRecord[]>(
      `
        SELECT id, order_number, table_id, status, total, created_at, updated_at
        FROM orders
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    return rows[0] ?? null;
  }

  async findItemsByOrderId(orderId: number): Promise<OrderItemRecord[]> {
    const [rows] = await this.pool.execute<OrderItemRecord[]>(
      `
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
    `,
      [orderId]
    );

    return rows;
  }

  async resolveMenuItems(items: NewOrderItemInput[]): Promise<ResolvedOrderItem[]> {
    if (items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const resolved: ResolvedOrderItem[] = [];

    for (const item of items) {
      const [rows] = await this.pool.execute<Array<{ id: number; price: string; preparation_time: number } & import('mysql2').RowDataPacket>>(
        `
          SELECT id, price, preparation_time
          FROM menu_items
          WHERE id = ? AND is_available = TRUE
          LIMIT 1
        `,
        [item.menuItemId]
      );

      const menuItem = rows[0];
      if (!menuItem) {
        throw new BadRequestException(`Menu item ${item.menuItemId} is unavailable`);
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

  async createOrder(orderNumber: string, tableId: number, items: ResolvedOrderItem[]): Promise<OrderRecord> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const [tableRows] = await connection.execute<Array<{ id: number; status: string } & import('mysql2').RowDataPacket>>(
        `
          SELECT id, status
          FROM \`tables\`
          WHERE id = ?
          LIMIT 1
        `,
        [tableId]
      );

      const table = tableRows[0];
      if (!table) {
        throw new NotFoundException('Table not found');
      }
      if (table.status === 'DISABLED') {
        throw new BadRequestException('Table is not available for ordering');
      }

      const total = items
        .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
        .toFixed(2);

      const [insertResult] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO orders (order_number, table_id, status, total)
          VALUES (?, ?, 'PENDING', ?)
        `,
        [orderNumber, tableId, total]
      );

      const orderId = Number(insertResult.insertId);
      const itemInserts = items.map((item) => [
        orderId,
        item.menuItemId,
        item.quantity,
        item.price,
        item.notes
      ]);

      await connection.query(
        `
          INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes)
          VALUES ?
        `,
        [itemInserts]
      );

      await connection.execute(
        `
          UPDATE \`tables\`
          SET status = 'OCCUPIED'
          WHERE id = ?
        `,
        [tableId]
      );

      await connection.commit();

      const created = await this.findById(orderId);
      if (!created) {
        throw new Error('Order creation failed');
      }

      return created;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateStatus(id: number, status: OrderStatus): Promise<OrderRecord> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const allowed = ALLOWED_TRANSITIONS[existing.status];
    if (!allowed.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${existing.status} to ${status}`);
    }

    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        `
          UPDATE orders
          SET status = ?
          WHERE id = ?
        `,
        [status, id]
      );

      if (status === 'DELIVERED' || status === 'CANCELLED') {
        await connection.execute(
          `
            UPDATE \`tables\`
            SET status = 'AVAILABLE'
            WHERE id = ?
          `,
          [existing.table_id]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to reload order after status update');
    }

    return updated;
  }

  async estimatePrepTimeForOrder(orderId: number): Promise<number> {
    const [rows] = await this.pool.execute<Array<{ max_time: number | null } & import('mysql2').RowDataPacket>>(
      `
        SELECT MAX(mi.preparation_time) AS max_time
        FROM order_items oi
        INNER JOIN menu_items mi ON mi.id = oi.menu_item_id
        WHERE oi.order_id = ?
      `,
      [orderId]
    );

    return Number(rows[0]?.max_time ?? 0);
  }
}
