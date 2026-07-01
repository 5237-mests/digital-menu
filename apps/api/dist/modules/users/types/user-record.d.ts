import type { RowDataPacket } from 'mysql2';
export type UserRole = 'ADMIN' | 'CHEF';
export interface UserRecord extends RowDataPacket {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly password_hash: string;
    readonly role: UserRole;
}
export interface PublicUser {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly role: UserRole;
}
export declare function toPublicUser(user: UserRecord): PublicUser;
