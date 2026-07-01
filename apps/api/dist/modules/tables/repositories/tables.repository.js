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
exports.TablesRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../../database/database.constants");
let TablesRepository = class TablesRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const [rows] = await this.pool.execute(`
        SELECT id, table_number, qr_code, status, created_at, updated_at
        FROM \`tables\`
        ORDER BY table_number ASC
      `);
        return rows;
    }
    async findByQrCode(qrCode) {
        const [rows] = await this.pool.execute(`
        SELECT id, table_number, qr_code, status, created_at, updated_at
        FROM \`tables\`
        WHERE qr_code = ?
        LIMIT 1
      `, [qrCode]);
        return rows[0] ?? null;
    }
    async updateStatus(id, status) {
        const [result] = await this.pool.execute(`
        UPDATE \`tables\`
        SET status = ?
        WHERE id = ?
      `, [status, id]);
        if (Number(result.affectedRows) === 0) {
            throw new common_1.NotFoundException('Table not found');
        }
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`
        SELECT id, table_number, qr_code, status, created_at, updated_at
        FROM \`tables\`
        WHERE id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await this.pool.execute(`
        INSERT INTO \`tables\` (table_number, qr_code, status)
        VALUES (?, ?, ?)
      `, [data.tableNumber, data.qrCode, data.status]);
        const insertId = Number(result.insertId);
        const created = await this.findById(insertId);
        if (!created) {
            throw new Error('Table creation failed');
        }
        return created;
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Table not found');
        }
        await this.pool.execute(`
        UPDATE \`tables\`
        SET table_number = COALESCE(?, table_number),
            qr_code = COALESCE(?, qr_code),
            status = COALESCE(?, status)
        WHERE id = ?
      `, [data.tableNumber ?? null, data.qrCode ?? null, data.status ?? null, id]);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload table after update');
        }
        return updated;
    }
    async delete(id) {
        const [result] = await this.pool.execute(`
        DELETE FROM \`tables\`
        WHERE id = ?
      `, [id]);
        const affectedRows = Number(result.affectedRows);
        if (affectedRows === 0) {
            throw new common_1.NotFoundException('Table not found');
        }
    }
};
exports.TablesRepository = TablesRepository;
exports.TablesRepository = TablesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], TablesRepository);
