import type { Pool } from 'mysql2/promise';
import { TenantContextService } from '../tenants/tenant-context.service';
/** Provider boundary: Chapa checkout initialization/verification can be enabled without changing subscription logic. */
export declare class BillingController {
    private readonly pool;
    private readonly tenantContext;
    constructor(pool: Pool, tenantContext: TenantContextService);
    chapaWebhook(xSignature: string | undefined, chapaSignature: string | undefined, payload: Record<string, unknown>): Promise<{
        received: boolean;
        duplicate: boolean;
    }>;
    renewalIntent(): Promise<{
        tenantId: number;
        provider: string;
        recurringEnabled: boolean;
        status: string;
    }>;
}
