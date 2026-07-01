import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';
import type { TableRecord } from '../types/table-record';

@Injectable()
export class TablesRepository {
    constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) { }

    async findAll(): Promise<TableRecord[]> {
        const [rows] = await this.pool.execute<TableRecord[]>(
            `
        SELECT id, table_number, qr_code, status, created_at, updated_at
        FROM \`tables\`
        ORDER BY table_number ASC
      `
        );

        return rows;
    }

    async findByQrCode(qrCode: string): Promise<TableRecord | null> {
        const [rows] = await this.pool.execute<TableRecord[]>(
            `
        SELECT id, table_number, qr_code, status, created_at, updated_at
        FROM \`tables\`
        WHERE qr_code = ?
        LIMIT 1
      `,
            [qrCode]
        );

        return rows[0] ?? null;
    }

    async updateStatus(id: number, status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED'): Promise<void> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `
        UPDATE \`tables\`
        SET status = ?
        WHERE id = ?
      `,
            [status, id]
        );

        if (Number(result.affectedRows) === 0) {
            throw new NotFoundException('Table not found');
        }
    }

    async findById(id: number): Promise<TableRecord | null> {
        const [rows] = await this.pool.execute<TableRecord[]>(
            `
        SELECT id, table_number, qr_code, status, created_at, updated_at
        FROM \`tables\`
        WHERE id = ?
        LIMIT 1
      `,
            [id]
        );

        return rows[0] ?? null;
    }

    async create(data: {
        tableNumber: number;
        qrCode: string;
        status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableRecord> {
        const [result] = await this.pool.execute(
            `
        INSERT INTO \`tables\` (table_number, qr_code, status)
        VALUES (?, ?, ?)
      `,
            [data.tableNumber, data.qrCode, data.status]
        );

        const insertId = Number((result as { insertId: number }).insertId);
        const created = await this.findById(insertId);
        if (!created) {
            throw new Error('Table creation failed');
        }

        return created;
    }

    async update(id: number, data: {
        tableNumber?: number;
        qrCode?: string;
        status?: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableRecord> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new NotFoundException('Table not found');
        }

        await this.pool.execute(
            `
        UPDATE \`tables\`
        SET table_number = COALESCE(?, table_number),
            qr_code = COALESCE(?, qr_code),
            status = COALESCE(?, status)
        WHERE id = ?
      `,
            [data.tableNumber ?? null, data.qrCode ?? null, data.status ?? null, id]
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload table after update');
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `
        DELETE FROM \`tables\`
        WHERE id = ?
      `,
            [id]
        );

        const affectedRows = Number(result.affectedRows);
        if (affectedRows === 0) {
            throw new NotFoundException('Table not found');
        }
    }
}
