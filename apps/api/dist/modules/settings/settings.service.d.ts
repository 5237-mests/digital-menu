import type { Pool } from 'mysql2/promise';
import type { SettingRecord } from './types/setting-record';
import { type SettingsDto } from './types/setting-record';
export declare class SettingsRepository {
    private readonly pool;
    constructor(pool: Pool);
    findAll(): Promise<SettingRecord[]>;
    upsert(key: string, value: string): Promise<void>;
}
export declare class SettingsService {
    private readonly settingsRepository;
    constructor(settingsRepository: SettingsRepository);
    getSettings(): Promise<SettingsDto>;
    updateSettings(data: SettingsDto): Promise<SettingsDto>;
}
