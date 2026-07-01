import { Inject, Injectable } from '@nestjs/common';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import { MYSQL_POOL } from '../../database/database.constants';

interface RefreshTokenRecord extends RowDataPacket {
  readonly id: number;
  readonly user_id: number;
  readonly token_id: string;
  readonly token_hash: string;
  readonly expires_at: Date;
  readonly revoked_at: Date | null;
}

@Injectable()
export class RefreshTokensRepository {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) {}

  async create(userId: number, tokenId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.pool.execute<ResultSetHeader>(
      `
        INSERT INTO auth_refresh_tokens (user_id, token_id, token_hash, expires_at)
        VALUES (?, ?, ?, ?)
      `,
      [userId, tokenId, tokenHash, expiresAt]
    );
  }

  async findActiveByTokenId(tokenId: string): Promise<RefreshTokenRecord | null> {
    const [rows] = await this.pool.execute<RefreshTokenRecord[]>(
      `
        SELECT id, user_id, token_id, token_hash, expires_at, revoked_at
        FROM auth_refresh_tokens
        WHERE token_id = ?
          AND revoked_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `,
      [tokenId]
    );

    return rows[0] ?? null;
  }

  async revokeByTokenId(tokenId: string): Promise<void> {
    await this.pool.execute<ResultSetHeader>(
      `
        UPDATE auth_refresh_tokens
        SET revoked_at = CURRENT_TIMESTAMP
        WHERE token_id = ?
          AND revoked_at IS NULL
      `,
      [tokenId]
    );
  }
}
