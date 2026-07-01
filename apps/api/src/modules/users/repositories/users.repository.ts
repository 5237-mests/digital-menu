import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';
import type { UserRecord, UserRole } from '../types/user-record';

@Injectable()
export class UsersRepository {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) {}

  async findAll(): Promise<UserRecord[]> {
    const [rows] = await this.pool.execute<UserRecord[]>(
      `
        SELECT id, name, email, password_hash, role
        FROM users
        ORDER BY name ASC
      `
    );

    return rows;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const [rows] = await this.pool.execute<UserRecord[]>(
      `
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    );

    return rows[0] ?? null;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const [rows] = await this.pool.execute<UserRecord[]>(
      `
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    return rows[0] ?? null;
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<UserRecord> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `,
      [data.name, data.email, data.passwordHash, data.role]
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

    await this.pool.execute(
      `
        UPDATE users
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            password_hash = COALESCE(?, password_hash),
            role = COALESCE(?, role)
        WHERE id = ?
      `,
      [data.name ?? null, data.email ?? null, data.passwordHash ?? null, data.role ?? null, id]
    );

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to reload user after update');
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
        DELETE FROM users
        WHERE id = ?
      `,
      [id]
    );

    if (Number(result.affectedRows) === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
