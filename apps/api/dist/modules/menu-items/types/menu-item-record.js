"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMenuItemDto = toMenuItemDto;
function toMenuItemDto(record) {
    return {
        id: record.id,
        categoryId: record.category_id,
        name: record.name,
        description: record.description,
        image: record.image,
        price: record.price,
        preparationTime: record.preparation_time,
        isAvailable: Boolean(record.is_available),
        createdAt: record.created_at,
        updatedAt: record.updated_at
    };
}
