import { UsersRepository } from './repositories/users.repository';
import type { PublicUser, UserRole } from './types/user-record';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    findAll(): Promise<PublicUser[]>;
    findByEmail(email: string): Promise<import("./types/user-record").UserRecord | null>;
    findPublicById(id: number): Promise<PublicUser | null>;
    create(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        tenantId?: number | null;
    }): Promise<PublicUser>;
    update(id: number, data: {
        name?: string;
        email?: string;
        password?: string;
        role?: UserRole;
    }): Promise<PublicUser>;
    remove(id: number): Promise<void>;
}
