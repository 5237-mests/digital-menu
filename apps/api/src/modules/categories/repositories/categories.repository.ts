import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';
import type { CategoryRecord } from '../types/category-record';

@Injectable()
export class CategoriesRepository {
    constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) { }

    async findAll(includeInactive = false): Promise<CategoryRecord[]> {
        const [rows] = await this.pool.execute<CategoryRecord[]>(
            `
        SELECT id, name, image, is_active, sort_order, created_at, updated_at
        FROM categories
        ${includeInactive ? '' : 'WHERE is_active = TRUE'}
        ORDER BY sort_order ASC, name ASC
      `
        );

        return rows;
    }

    async findById(id: number, includeInactive = false): Promise<CategoryRecord | null> {
        const [rows] = await this.pool.execute<CategoryRecord[]>(
            `
        SELECT id, name, image, is_active, sort_order, created_at, updated_at
        FROM categories
        WHERE id = ?
        ${includeInactive ? '' : 'AND is_active = TRUE'}
        LIMIT 1
      `,
            [id]
        );

        return rows[0] ?? null;
    }

    async create(data: {
        name: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryRecord> {
        const [result] = await this.pool.execute(
            `
        INSERT INTO categories (name, image, is_active, sort_order)
        VALUES (?, ?, ?, ?)
      `,
            [data.name, data.image ?? null, data.isActive ?? true, data.sortOrder ?? 0]
        );

        const insertId = Number((result as { insertId: number }).insertId);

        const created = await this.findById(insertId);
        if (!created) {
            throw new Error('Category creation failed');
        }

        return created;
    }

    async update(id: number, data: {
        name?: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryRecord> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Category not found');
        }

        await this.pool.execute(
            `
        UPDATE categories
        SET name = COALESCE(?, name),
            image = COALESCE(?, image),
            is_active = COALESCE(?, is_active),
            sort_order = COALESCE(?, sort_order)
        WHERE id = ?
      `,
            [data.name ?? null, data.image ?? null, data.isActive ?? null, data.sortOrder ?? null, id]
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload category after update');
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `
        DELETE FROM categories
        WHERE id = ?
      `,
            [id]
        );

        const affectedRows = Number(result.affectedRows);
        if (affectedRows === 0) {
            throw new NotFoundException('Category not found');
        }
    }
}
