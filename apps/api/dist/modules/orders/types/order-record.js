"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOrderDto = toOrderDto;
function toOrderDto(record) {
    return {
        id: record.id,
        orderNumber: record.order_number,
        tableId: record.table_id,
        status: record.status,
        total: record.total,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
