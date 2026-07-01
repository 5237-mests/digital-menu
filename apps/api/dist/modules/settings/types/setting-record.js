"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordsToSettingsDto = recordsToSettingsDto;
function recordsToSettingsDto(records) {
    const map = new Map(records.map((record) => [record.setting_key, record.setting_value]));
    return {
        restaurantName: map.get('restaurant_name') ?? 'Restaurant System',
        currency: map.get('currency') ?? 'USD',
        taxRate: map.get('tax_rate') ?? '0.00'
    };
}
