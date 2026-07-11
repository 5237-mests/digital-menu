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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
let TenantsService = class TenantsService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findBySlug(slug) { const [rows] = await this.pool.execute('SELECT id, name, slug, status, grace_ends_at FROM tenants WHERE slug = ? LIMIT 1', [slug]); return rows[0] ?? null; }
    async findAll() { const [rows] = await this.pool.execute('SELECT id, name, slug, status, grace_ends_at FROM tenants ORDER BY name'); return rows; }
    async create(name, slug) { const [result] = await this.pool.execute('INSERT INTO tenants (name, slug, status) VALUES (?, ?, \'TRIAL\')', [name, slug]); const tenant = await this.findById(Number(result.insertId)); if (!tenant)
        throw new Error('Tenant creation failed'); return tenant; }
    async findById(id) { const [rows] = await this.pool.execute('SELECT id, name, slug, status, grace_ends_at FROM tenants WHERE id = ? LIMIT 1', [id]); return rows[0] ?? null; }
    async setStatus(id, status) { await this.pool.execute('UPDATE tenants SET status = ?, grace_ends_at = CASE WHEN ? = \'PAST_DUE\' THEN DATE_ADD(NOW(), INTERVAL 7 DAY) ELSE NULL END WHERE id = ?', [status, status, id]); const tenant = await this.findById(id); if (!tenant)
        throw new common_1.NotFoundException('Tenant not found'); return tenant; }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], TenantsService);
