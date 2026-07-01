"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTableDto = toTableDto;
function toTableDto(record) {
    return {
        id: record.id,
        tableNumber: record.table_number,
        qrCode: record.qr_code,
        status: record.status,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
