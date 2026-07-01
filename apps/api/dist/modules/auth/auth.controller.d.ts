import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import type { AuthenticatedUser, AuthResponse, AuthTokens } from './types/auth.types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<AuthResponse>;
    refresh(dto: RefreshTokenDto): Promise<AuthTokens>;
    logout(dto: RefreshTokenDto): Promise<{
        readonly success: true;
    }>;
    me(user: AuthenticatedUser): AuthenticatedUser;
}
