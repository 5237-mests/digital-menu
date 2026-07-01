import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { MYSQL_POOL } from '../database/database.constants';
import type { SettingRecord } from './types/setting-record';
import { recordsToSettingsDto, type SettingsDto } from './types/setting-record';

@Injectable()
export class SettingsRepository {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool) {}

  async findAll(): Promise<SettingRecord[]> {
    const [rows] = await this.pool.execute<SettingRecord[]>(
      `
        SELECT id, setting_key, setting_value, updated_at
        FROM settings
        ORDER BY setting_key ASC
      `
    );

    return rows;
  }

  async upsert(key: string, value: string): Promise<void> {
    await this.pool.execute(
      `
        INSERT INTO settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
      `,
      [key, value]
    );
  }
}

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async getSettings(): Promise<SettingsDto> {
    const records = await this.settingsRepository.findAll();
    return recordsToSettingsDto(records);
  }

  async updateSettings(data: SettingsDto): Promise<SettingsDto> {
    await this.settingsRepository.upsert('restaurant_name', data.restaurantName);
    await this.settingsRepository.upsert('currency', data.currency);
    await this.settingsRepository.upsert('tax_rate', data.taxRate);
    return this.getSettings();
  }
}
