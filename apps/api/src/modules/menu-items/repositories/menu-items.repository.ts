import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { MenuItemRecord } from '../types/menu-item-record';

@Injectable()
export class MenuItemsRepository {
    constructor(@Inject(MYSQL_POOL) private readonly pool: Pool, private readonly tenantContext: TenantContextService) { }

    async findAll(includeUnavailable = false): Promise<MenuItemRecord[]> {
        const [rows] = await this.pool.execute<MenuItemRecord[]>(
            `
        SELECT id, category_id, name, description, image, price, preparation_time, is_available, created_at, updated_at
        FROM menu_items
        WHERE tenant_id = ? ${includeUnavailable ? '' : 'AND is_available = TRUE'}
        ORDER BY name ASC
      `
        , [this.tenantContext.requireId()]);

        return rows;
    }

    async findById(id: number, includeUnavailable = false): Promise<MenuItemRecord | null> {
        const tenantId = this.tenantContext.requireId();
        const [rows] = await this.pool.execute<MenuItemRecord[]>(
            `
        SELECT id, category_id, name, description, image, price, preparation_time, is_available, created_at, updated_at
        FROM menu_items
        WHERE id = ? AND tenant_id = ?
        ${includeUnavailable ? '' : 'AND is_available = TRUE'}
        LIMIT 1
      `,
            [id, tenantId]
        );

        return rows[0] ?? null;
    }

    async create(data: {
        categoryId: number;
        name: string;
        description?: string;
        image?: string;
        price: string;
        preparationTime: number;
        isAvailable?: boolean;
    }): Promise<MenuItemRecord> {
        const tenantId = this.tenantContext.requireId();
        const [result] = await this.pool.execute(
            `
        INSERT INTO menu_items (tenant_id, category_id, name, description, image, price, preparation_time, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                tenantId, data.categoryId,
                data.name,
                data.description ?? null,
                data.image ?? null,
                data.price,
                data.preparationTime,
                data.isAvailable ?? true
            ]
        );

        const insertId = Number((result as { insertId: number }).insertId);
        const created = await this.findById(insertId);
        if (!created) {
            throw new Error('Menu item creation failed');
        }

        return created;
    }

    async update(id: number, data: {
        categoryId?: number;
        name?: string;
        description?: string;
        image?: string;
        price?: string;
        preparationTime?: number;
        isAvailable?: boolean;
    }): Promise<MenuItemRecord> {
        const tenantId = this.tenantContext.requireId();
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Menu item not found');
        }

        await this.pool.execute(
            `
        UPDATE menu_items
        SET category_id = COALESCE(?, category_id),
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            image = COALESCE(?, image),
            price = COALESCE(?, price),
            preparation_time = COALESCE(?, preparation_time),
            is_available = COALESCE(?, is_available)
        WHERE id = ? AND tenant_id = ?
      `,
            [
                data.categoryId ?? null,
                data.name ?? null,
                data.description ?? null,
                data.image ?? null,
                data.price ?? null,
                data.preparationTime ?? null,
                data.isAvailable ?? null,
                id, tenantId
            ]
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload menu item after update');
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        const tenantId = this.tenantContext.requireId();
        const [result] = await this.pool.execute<ResultSetHeader>(
            `
        DELETE FROM menu_items
        WHERE id = ? AND tenant_id = ?
      `,
            [id, tenantId]
        );

        const affectedRows = Number(result.affectedRows);
        if (affectedRows === 0) {
            throw new NotFoundException('Menu item not found');
        }
    }
}
