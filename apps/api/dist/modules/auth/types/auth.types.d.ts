import type { PublicUser } from '../../users/types/user-record';
import type { UserRole } from '../../users/types/user-record';
export interface JwtAccessPayload {
    readonly sub: number;
    readonly email: string;
    readonly role: UserRole;
}
export interface JwtRefreshPayload extends JwtAccessPayload {
    readonly tokenId: string;
}
export interface AuthenticatedUser {
    readonly id: number;
    readonly email: string;
    readonly role: UserRole;
}
export interface AuthTokens {
    readonly accessToken: string;
    readonly refreshToken: string;
}
export interface AuthResponse extends AuthTokens {
    readonly user: PublicUser;
}
