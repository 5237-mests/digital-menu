import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface TenantContextValue { readonly id: number; readonly slug: string; readonly status: string; }

@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<TenantContextValue>();
  run(context: TenantContextValue, next: () => void): void { this.storage.run(context, next); }
  current(): TenantContextValue | undefined { return this.storage.getStore(); }
  requireId(): number { const tenant = this.current(); if (!tenant) throw new UnauthorizedException('Tenant context is required'); return tenant.id; }
}
