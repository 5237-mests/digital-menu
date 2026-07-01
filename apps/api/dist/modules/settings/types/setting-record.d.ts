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
export declare function recordsToSettingsDto(records: SettingRecord[]): SettingsDto;
