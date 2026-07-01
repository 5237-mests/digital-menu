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
exports.CategoriesRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../../database/database.constants");
let CategoriesRepository = class CategoriesRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll(includeInactive = false) {
        const [rows] = await this.pool.execute(`
        SELECT id, name, image, is_active, sort_order, created_at, updated_at
        FROM categories
        ${includeInactive ? '' : 'WHERE is_active = TRUE'}
        ORDER BY sort_order ASC, name ASC
      `);
        return rows;
    }
    async findById(id, includeInactive = false) {
        const [rows] = await this.pool.execute(`
        SELECT id, name, image, is_active, sort_order, created_at, updated_at
        FROM categories
        WHERE id = ?
        ${includeInactive ? '' : 'AND is_active = TRUE'}
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await this.pool.execute(`
        INSERT INTO categories (name, image, is_active, sort_order)
        VALUES (?, ?, ?, ?)
      `, [data.name, data.image ?? null, data.isActive ?? true, data.sortOrder ?? 0]);
        const insertId = Number(result.insertId);
        const created = await this.findById(insertId);
        if (!created) {
            throw new Error('Category creation failed');
        }
        return created;
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.pool.execute(`
        UPDATE categories
        SET name = COALESCE(?, name),
            image = COALESCE(?, image),
            is_active = COALESCE(?, is_active),
            sort_order = COALESCE(?, sort_order)
        WHERE id = ?
      `, [data.name ?? null, data.image ?? null, data.isActive ?? null, data.sortOrder ?? null, id]);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload category after update');
        }
        return updated;
    }
    async delete(id) {
        const [result] = await this.pool.execute(`
        DELETE FROM categories
        WHERE id = ?
      `, [id]);
        const affectedRows = Number(result.affectedRows);
        if (affectedRows === 0) {
            throw new common_1.NotFoundException('Category not found');
        }
    }
};
exports.CategoriesRepository = CategoriesRepository;
exports.CategoriesRepository = CategoriesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], CategoriesRepository);
