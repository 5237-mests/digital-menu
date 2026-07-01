"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCategoryDto = toCategoryDto;
function toCategoryDto(record) {
    return {
        id: record.id,
        name: record.name,
        image: record.image,
        isActive: Boolean(record.is_active),
        sortOrder: record.sort_order,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
