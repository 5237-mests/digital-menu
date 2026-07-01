import type { Pool } from 'mysql2/promise';
import type { UserRecord, UserRole } from '../types/user-record';
export declare class UsersRepository {
    private readonly pool;
    constructor(pool: Pool);
    findAll(): Promise<UserRecord[]>;
    findByEmail(email: string): Promise<UserRecord | null>;
    findById(id: number): Promise<UserRecord | null>;
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
        role: UserRole;
    }): Promise<UserRecord>;
    update(id: number, data: {
        name?: string;
        email?: string;
        passwordHash?: string;
        role?: UserRole;
    }): Promise<UserRecord>;
    delete(id: number): Promise<void>;
}
