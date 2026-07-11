import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import type { AuthenticatedUser } from '../types/auth.types';

interface AuthenticatedRequest {
  readonly headers: {
    readonly authorization?: string | string[];
  };
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly tenantContext: TenantContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);
    const payload = await this.authService.verifyAccessToken(token);

    request.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId
    };
    if (payload.role !== 'PLATFORM_ADMIN') {
      const tenant = this.tenantContext.current();
      if (!tenant || payload.tenantId !== tenant.id) throw new ForbiddenException('Tenant access denied');
      if (!['TRIAL', 'ACTIVE', 'PAST_DUE'].includes(tenant.status)) throw new ForbiddenException('Restaurant subscription is suspended');
    }

    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest): string {
    const authorization = request.headers.authorization;

    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    return token;
  }
}
