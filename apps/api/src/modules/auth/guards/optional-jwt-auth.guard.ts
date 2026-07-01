import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { AuthenticatedUser } from '../types/auth.types';

interface AuthenticatedRequest {
  readonly headers: {
    readonly authorization?: string | string[];
  };
  user?: AuthenticatedUser;
}

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization || Array.isArray(authorization)) {
      return true;
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return true;
    }

    try {
      const payload = await this.authService.verifyAccessToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } catch {
      return true;
    }

    return true;
  }
}
