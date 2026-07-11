import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { UserRecord, UserRole } from '../types/user-record';

@Injectable()
export class UsersRepository {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool, private readonly tenantContext: TenantContextService) {}

  async findAll(): Promise<UserRecord[]> {
    const tenantId = this.tenantContext.requireId();
    const [rows] = await this.pool.execute<UserRecord[]>(
      `
        SELECT id, tenant_id, name, email, password_hash, role
        FROM users
        WHERE tenant_id = ?
        ORDER BY name ASC
      `, [tenantId]
    );

    return rows;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const tenantId = this.tenantContext.current()?.id ?? 0;
    const [rows] = await this.pool.execute<UserRecord[]>(
      `
        SELECT id, tenant_id, name, email, password_hash, role
        FROM users
        WHERE email = ? AND (tenant_id = ? OR role = 'PLATFORM_ADMIN')
        LIMIT 1
      `,
      [email, tenantId]
    );

    return rows[0] ?? null;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const tenantId = this.tenantContext.current()?.id ?? 0;
    const [rows] = await this.pool.execute<UserRecord[]>(
      `
        SELECT id, tenant_id, name, email, password_hash, role
        FROM users
        WHERE id = ? AND (tenant_id = ? OR role = 'PLATFORM_ADMIN')
        LIMIT 1
      `,
      [id, tenantId]
    );

    return rows[0] ?? null;
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    tenantId?: number | null;
  }): Promise<UserRecord> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
        INSERT INTO users (tenant_id, name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
      `,
      [data.tenantId ?? null, data.name, data.email, data.passwordHash, data.role]
    );

    const created = await this.findById(Number(result.insertId));
    if (!created) {
      throw new Error('User creation failed');
    }

    return created;
  }

  async update(id: number, data: {
    name?: string;
    email?: string;
    passwordHash?: string;
    role?: UserRole;
  }): Promise<UserRecord> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const tenantId = this.tenantContext.requireId();
    await this.pool.execute(
      `
        UPDATE users
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            password_hash = COALESCE(?, password_hash),
            role = COALESCE(?, role)
        WHERE id = ? AND tenant_id = ?
      `,
      [data.name ?? null, data.email ?? null, data.passwordHash ?? null, data.role ?? null, id, tenantId]
    );

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to reload user after update');
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    const tenantId = this.tenantContext.requireId();
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
        DELETE FROM users
        WHERE id = ? AND tenant_id = ?
      `,
      [id, tenantId]
    );

    if (Number(result.affectedRows) === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
