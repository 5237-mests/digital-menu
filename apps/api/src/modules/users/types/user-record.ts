import type { RowDataPacket } from 'mysql2';

export type UserRole = 'PLATFORM_ADMIN' | 'OWNER' | 'ADMIN' | 'CHEF';

export interface UserRecord extends RowDataPacket {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly password_hash: string;
  readonly role: UserRole;
  readonly tenant_id: number | null;
}

export interface PublicUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly tenantId: number | null;
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenant_id
  };
}
