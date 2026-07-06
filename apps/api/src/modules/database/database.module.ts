import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createPool } from 'mysql2/promise';
import { MYSQL_POOL } from './database.constants';
import { DatabaseService } from './database.service';
import { buildMysqlPoolConfig } from './mysql-pool.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MYSQL_POOL,
      useFactory: () => createPool(buildMysqlPoolConfig())

      // useFactory: async () => {
      //   const pool = createPool(buildMysqlPoolConfig());

      //   try {
      //     await pool.query('SELECT 1');
      //     console.log('[DB] Connected successfully');
      //     return pool;
      //   } catch (error) {
      //     console.error('[DB] Connection failed:', error);
      //     throw error;
      //   }
      // }
    },
    DatabaseService
  ],
  exports: [MYSQL_POOL, DatabaseService]
})
export class DatabaseModule { }
