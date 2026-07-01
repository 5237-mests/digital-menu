import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
import type { SettingsDto } from './types/setting-record';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<SettingsDto>;
    updateSettings(dto: UpdateSettingsDto): Promise<SettingsDto>;
}
