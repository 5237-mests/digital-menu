import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';
import type { AuthResponse, AuthTokens, JwtAccessPayload } from './types/auth.types';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly refreshTokensRepository;
    private readonly accessTokenTtlSeconds;
    private readonly refreshTokenTtlSeconds;
    constructor(usersService: UsersService, jwtService: JwtService, refreshTokensRepository: RefreshTokensRepository);
    login(email: string, password: string): Promise<AuthResponse>;
    refresh(refreshToken: string): Promise<AuthTokens>;
    logout(refreshToken: string): Promise<void>;
    verifyAccessToken(accessToken: string): Promise<JwtAccessPayload>;
    private verifyRefreshToken;
    private issueTokens;
    private hashToken;
}
