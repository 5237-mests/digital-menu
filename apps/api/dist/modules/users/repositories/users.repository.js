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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../../database/database.constants");
const tenant_context_service_1 = require("../../tenants/tenant-context.service");
let UsersRepository = class UsersRepository {
    pool;
    tenantContext;
    constructor(pool, tenantContext) {
        this.pool = pool;
        this.tenantContext = tenantContext;
    }
    async findAll() {
        const tenantId = this.tenantContext.requireId();
        const [rows] = await this.pool.execute(`
        SELECT id, tenant_id, name, email, password_hash, role
        FROM users
        WHERE tenant_id = ?
        ORDER BY name ASC
      `, [tenantId]);
        return rows;
    }
    async findByEmail(email) {
        const tenantId = this.tenantContext.current()?.id ?? 0;
        const [rows] = await this.pool.execute(`
        SELECT id, tenant_id, name, email, password_hash, role
        FROM users
        WHERE email = ? AND (tenant_id = ? OR role = 'PLATFORM_ADMIN')
        LIMIT 1
      `, [email, tenantId]);
        return rows[0] ?? null;
    }
    async findById(id) {
        const tenantId = this.tenantContext.current()?.id ?? 0;
        const [rows] = await this.pool.execute(`
        SELECT id, tenant_id, name, email, password_hash, role
        FROM users
        WHERE id = ? AND (tenant_id = ? OR role = 'PLATFORM_ADMIN')
        LIMIT 1
      `, [id, tenantId]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await this.pool.execute(`
        INSERT INTO users (tenant_id, name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
      `, [data.tenantId ?? null, data.name, data.email, data.passwordHash, data.role]);
        const created = await this.findById(Number(result.insertId));
        if (!created) {
            throw new Error('User creation failed');
        }
        return created;
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        const tenantId = this.tenantContext.requireId();
        await this.pool.execute(`
        UPDATE users
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            password_hash = COALESCE(?, password_hash),
            role = COALESCE(?, role)
        WHERE id = ? AND tenant_id = ?
      `, [data.name ?? null, data.email ?? null, data.passwordHash ?? null, data.role ?? null, id, tenantId]);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload user after update');
        }
        return updated;
    }
    async delete(id) {
        const tenantId = this.tenantContext.requireId();
        const [result] = await this.pool.execute(`
        DELETE FROM users
        WHERE id = ? AND tenant_id = ?
      `, [id, tenantId]);
        if (Number(result.affectedRows) === 0) {
            throw new common_1.NotFoundException('User not found');
        }
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object, tenant_context_service_1.TenantContextService])
], UsersRepository);
