import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { MYSQL_POOL } from './database.constants';

export interface DatabaseHealth {
  readonly status: 'ok';
}

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) {}

  getPool(): Pool {
    return this.pool;
  }

  async ping(): Promise<DatabaseHealth> {
    await this.pool.execute<RowDataPacket[]>('SELECT 1 AS healthcheck');

    return { status: 'ok' };
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
