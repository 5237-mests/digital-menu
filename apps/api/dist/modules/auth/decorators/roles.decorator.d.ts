import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../users/types/user-record';
export declare const ROLES_KEY = "roles";
export declare function Roles(...roles: UserRole[]): ReturnType<typeof SetMetadata>;
