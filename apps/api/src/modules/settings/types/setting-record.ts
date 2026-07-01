import type { RowDataPacket } from 'mysql2';

export interface SettingRecord extends RowDataPacket {
  readonly id: number;
  readonly setting_key: string;
  readonly setting_value: string;
  readonly updated_at: string;
}

export interface SettingsDto {
  readonly restaurantName: string;
  readonly currency: string;
  readonly taxRate: string;
}

export function recordsToSettingsDto(records: SettingRecord[]): SettingsDto {
  const map = new Map(records.map((record) => [record.setting_key, record.setting_value]));

  return {
    restaurantName: map.get('restaurant_name') ?? 'Restaurant System',
    currency: map.get('currency') ?? 'USD',
    taxRate: map.get('tax_rate') ?? '0.00'
  };
}
