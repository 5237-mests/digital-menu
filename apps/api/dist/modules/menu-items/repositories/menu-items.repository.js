"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemsRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../../database/database.constants");
let MenuItemsRepository = class MenuItemsRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll(includeUnavailable = false) {
        const [rows] = await this.pool.execute(`
        SELECT id, category_id, name, description, image, price, preparation_time, is_available, created_at, updated_at
        FROM menu_items
        ${includeUnavailable ? '' : 'WHERE is_available = TRUE'}
        ORDER BY name ASC
      `);
        return rows;
    }
    async findById(id, includeUnavailable = false) {
        const [rows] = await this.pool.execute(`
        SELECT id, category_id, name, description, image, price, preparation_time, is_available, created_at, updated_at
        FROM menu_items
        WHERE id = ?
        ${includeUnavailable ? '' : 'AND is_available = TRUE'}
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await this.pool.execute(`
        INSERT INTO menu_items (category_id, name, description, image, price, preparation_time, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
            data.categoryId,
            data.name,
            data.description ?? null,
            data.image ?? null,
            data.price,
            data.preparationTime,
            data.isAvailable ?? true
        ]);
        const insertId = Number(result.insertId);
        const created = await this.findById(insertId);
        if (!created) {
            throw new Error('Menu item creation failed');
        }
        return created;
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        await this.pool.execute(`
        UPDATE menu_items
        SET category_id = COALESCE(?, category_id),
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            image = COALESCE(?, image),
            price = COALESCE(?, price),
            preparation_time = COALESCE(?, preparation_time),
            is_available = COALESCE(?, is_available)
        WHERE id = ?
      `, [
            data.categoryId ?? null,
            data.name ?? null,
            data.description ?? null,
            data.image ?? null,
            data.price ?? null,
            data.preparationTime ?? null,
            data.isAvailable ?? null,
            id
        ]);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload menu item after update');
        }
        return updated;
    }
    async delete(id) {
        const [result] = await this.pool.execute(`
        DELETE FROM menu_items
        WHERE id = ?
      `, [id]);
        const affectedRows = Number(result.affectedRows);
        if (affectedRows === 0) {
            throw new common_1.NotFoundException('Menu item not found');
        }
    }
};
exports.MenuItemsRepository = MenuItemsRepository;
exports.MenuItemsRepository = MenuItemsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], MenuItemsRepository);
