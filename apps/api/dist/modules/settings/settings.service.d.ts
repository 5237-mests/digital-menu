import type { Pool } from 'mysql2/promise';
import { TenantContextService } from '../tenants/tenant-context.service';
import type { SettingRecord } from './types/setting-record';
import { type SettingsDto } from './types/setting-record';
export declare class SettingsRepository {
    private readonly pool;
    private readonly tenantContext;
    constructor(pool: Pool, tenantContext: TenantContextService);
    findAll(): Promise<SettingRecord[]>;
    upsert(key: string, value: string): Promise<void>;
}
export declare class SettingsService {
    private readonly settingsRepository;
    constructor(settingsRepository: SettingsRepository);
    getSettings(): Promise<SettingsDto>;
    updateSettings(data: SettingsDto): Promise<SettingsDto>;
}
