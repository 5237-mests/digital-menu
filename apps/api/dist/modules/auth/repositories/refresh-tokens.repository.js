"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../../database/database.constants");
let RefreshTokensRepository = class RefreshTokensRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async create(userId, tokenId, tokenHash, expiresAt) {
        await this.pool.execute(`
        INSERT INTO auth_refresh_tokens (user_id, token_id, token_hash, expires_at)
        VALUES (?, ?, ?, ?)
      `, [userId, tokenId, tokenHash, expiresAt]);
    }
    async findActiveByTokenId(tokenId) {
        const [rows] = await this.pool.execute(`
        SELECT id, user_id, token_id, token_hash, expires_at, revoked_at
        FROM auth_refresh_tokens
        WHERE token_id = ?
          AND revoked_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `, [tokenId]);
        return rows[0] ?? null;
    }
    async revokeByTokenId(tokenId) {
        await this.pool.execute(`
        UPDATE auth_refresh_tokens
        SET revoked_at = CURRENT_TIMESTAMP
        WHERE token_id = ?
          AND revoked_at IS NULL
      `, [tokenId]);
    }
};
exports.RefreshTokensRepository = RefreshTokensRepository;
exports.RefreshTokensRepository = RefreshTokensRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], RefreshTokensRepository);
