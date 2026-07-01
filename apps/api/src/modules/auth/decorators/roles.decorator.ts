import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../users/types/user-record';

export const ROLES_KEY = 'roles';

export function Roles(...roles: UserRole[]): ReturnType<typeof SetMetadata> {
  return SetMetadata(ROLES_KEY, roles);
}
