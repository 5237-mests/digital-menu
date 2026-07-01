import type { RowDataPacket } from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
interface RefreshTokenRecord extends RowDataPacket {
    readonly id: number;
    readonly user_id: number;
    readonly token_id: string;
    readonly token_hash: string;
    readonly expires_at: Date;
    readonly revoked_at: Date | null;
}
export declare class RefreshTokensRepository {
    private readonly pool;
    constructor(pool: Pool);
    create(userId: number, tokenId: string, tokenHash: string, expiresAt: Date): Promise<void>;
    findActiveByTokenId(tokenId: string): Promise<RefreshTokenRecord | null>;
    revokeByTokenId(tokenId: string): Promise<void>;
}
export {};
