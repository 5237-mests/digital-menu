import { createHash, randomUUID } from 'node:crypto';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { toPublicUser } from '../users/types/user-record';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';
import type { AuthResponse, AuthTokens, JwtAccessPayload, JwtRefreshPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly accessTokenTtlSeconds = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900);
  private readonly refreshTokenTtlSeconds = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 604800);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) { }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const passwordMatches = await compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id
    });

    return {
      user: toPublicUser(user),
      ...tokens
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const storedToken = await this.refreshTokensRepository.findActiveByTokenId(payload.tokenId);

    if (!storedToken || storedToken.token_hash !== this.hashToken(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshTokensRepository.revokeByTokenId(payload.tokenId);

    return this.issueTokens({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId
    });
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = await this.verifyRefreshToken(refreshToken);
    await this.refreshTokensRepository.revokeByTokenId(payload.tokenId);
  }

  async verifyAccessToken(accessToken: string): Promise<JwtAccessPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtAccessPayload>(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access_secret'
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtRefreshPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh_secret'
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async issueTokens(payload: JwtAccessPayload): Promise<AuthTokens> {
    const tokenId = randomUUID();
    const refreshPayload: JwtRefreshPayload = {
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

    await this.refreshTokensRepository.create(
      payload.sub,
      tokenId,
      this.hashToken(refreshToken),
      new Date(Date.now() + this.refreshTokenTtlSeconds * 1000)
    );

    return {
      accessToken,
      refreshToken
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
