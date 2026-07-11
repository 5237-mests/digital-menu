import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { MYSQL_POOL } from '../database/database.constants';

export interface TenantRecord extends RowDataPacket { id: number; name: string; slug: string; status: string; grace_ends_at: Date | null; }
@Injectable()
export class TenantsService {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) {}
  async findBySlug(slug: string): Promise<TenantRecord | null> { const [rows] = await this.pool.execute<TenantRecord[]>('SELECT id, name, slug, status, grace_ends_at FROM tenants WHERE slug = ? LIMIT 1', [slug]); return rows[0] ?? null; }
  async findAll(): Promise<TenantRecord[]> { const [rows] = await this.pool.execute<TenantRecord[]>('SELECT id, name, slug, status, grace_ends_at FROM tenants ORDER BY name'); return rows; }
  async create(name: string, slug: string): Promise<TenantRecord> { const [result] = await this.pool.execute<any>('INSERT INTO tenants (name, slug, status) VALUES (?, ?, \'TRIAL\')', [name, slug]); const tenant = await this.findById(Number(result.insertId)); if (!tenant) throw new Error('Tenant creation failed'); return tenant; }
  async findById(id: number): Promise<TenantRecord | null> { const [rows] = await this.pool.execute<TenantRecord[]>('SELECT id, name, slug, status, grace_ends_at FROM tenants WHERE id = ? LIMIT 1', [id]); return rows[0] ?? null; }
  async setStatus(id: number, status: string): Promise<TenantRecord> { await this.pool.execute('UPDATE tenants SET status = ?, grace_ends_at = CASE WHEN ? = \'PAST_DUE\' THEN DATE_ADD(NOW(), INTERVAL 7 DAY) ELSE NULL END WHERE id = ?', [status, status, id]); const tenant = await this.findById(id); if (!tenant) throw new NotFoundException('Tenant not found'); return tenant; }
}
