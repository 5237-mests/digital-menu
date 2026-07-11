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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const users_service_1 = require("../users/users.service");
const user_record_1 = require("../users/types/user-record");
const refresh_tokens_repository_1 = require("./repositories/refresh-tokens.repository");
let AuthService = class AuthService {
    usersService;
    jwtService;
    refreshTokensRepository;
    accessTokenTtlSeconds = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900);
    refreshTokenTtlSeconds = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 604800);
    constructor(usersService, jwtService, refreshTokensRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.refreshTokensRepository = refreshTokensRepository;
    }
    async login(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatches = await (0, bcryptjs_1.compare)(password, user.password_hash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const tokens = await this.issueTokens({
            sub: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenant_id
        });
        return {
            user: (0, user_record_1.toPublicUser)(user),
            ...tokens
        };
    }
    async refresh(refreshToken) {
        const payload = await this.verifyRefreshToken(refreshToken);
        const storedToken = await this.refreshTokensRepository.findActiveByTokenId(payload.tokenId);
        if (!storedToken || storedToken.token_hash !== this.hashToken(refreshToken)) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.refreshTokensRepository.revokeByTokenId(payload.tokenId);
        return this.issueTokens({
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId
        });
    }
    async logout(refreshToken) {
        const payload = await this.verifyRefreshToken(refreshToken);
        await this.refreshTokensRepository.revokeByTokenId(payload.tokenId);
    }
    async verifyAccessToken(accessToken) {
        try {
            return await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access_secret'
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
    async verifyRefreshToken(refreshToken) {
        try {
            return await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh_secret'
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async issueTokens(payload) {
        const tokenId = (0, node_crypto_1.randomUUID)();
        const refreshPayload = {
            ...payload,
            tokenId
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access_secret',
                expiresIn: this.accessTokenTtlSeconds
            }),
            this.jwtService.signAsync(refreshPayload, {
                secret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh_secret',
                expiresIn: this.refreshTokenTtlSeconds
            })
        ]);
        await this.refreshTokensRepository.create(payload.sub, tokenId, this.hashToken(refreshToken), new Date(Date.now() + this.refreshTokenTtlSeconds * 1000));
        return {
            accessToken,
            refreshToken
        };
    }
    hashToken(token) {
        return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        refresh_tokens_repository_1.RefreshTokensRepository])
], AuthService);
