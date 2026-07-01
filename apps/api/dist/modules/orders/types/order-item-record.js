"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOrderItemDto = toOrderItemDto;
function toOrderItemDto(record) {
    return {
        id: record.id,
        orderId: record.order_id,
        menuItemId: record.menu_item_id,
        item_name: record.name,
        quantity: record.quantity,
        price: record.price,
        notes: record.notes,
        createdAt: record.created_at
    };
}
