import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
export declare class PlatformController {
    private readonly tenants;
    private readonly users;
    constructor(tenants: TenantsService, users: UsersService);
    setupInstructions(): {
        message: string;
        requiredHeaders: string[];
        requiredBody: {
            name: string;
            email: string;
            password: string;
        };
    };
    setup(secret: string | undefined, body: {
        name: string;
        email: string;
        password: string;
    }): Promise<import("../users/types/user-record").PublicUser>;
    list(): Promise<import("../tenants/tenants.service").TenantRecord[]>;
    provision(body: {
        name: string;
        slug: string;
        ownerName: string;
        ownerEmail: string;
        ownerPassword: string;
    }): Promise<{
        tenant: import("../tenants/tenants.service").TenantRecord;
        owner: import("../users/types/user-record").PublicUser;
    }>;
}
