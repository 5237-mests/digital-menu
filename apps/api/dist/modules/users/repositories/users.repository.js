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
let UsersRepository = class UsersRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const [rows] = await this.pool.execute(`
        SELECT id, name, email, password_hash, role
        FROM users
        ORDER BY name ASC
      `);
        return rows;
    }
    async findByEmail(email) {
        const [rows] = await this.pool.execute(`
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = ?
        LIMIT 1
      `, [email]);
        return rows[0] ?? null;
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await this.pool.execute(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `, [data.name, data.email, data.passwordHash, data.role]);
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
        await this.pool.execute(`
        UPDATE users
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            password_hash = COALESCE(?, password_hash),
            role = COALESCE(?, role)
        WHERE id = ?
      `, [data.name ?? null, data.email ?? null, data.passwordHash ?? null, data.role ?? null, id]);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Failed to reload user after update');
        }
        return updated;
    }
    async delete(id) {
        const [result] = await this.pool.execute(`
        DELETE FROM users
        WHERE id = ?
      `, [id]);
        if (Number(result.affectedRows) === 0) {
            throw new common_1.NotFoundException('User not found');
        }
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], UsersRepository);
