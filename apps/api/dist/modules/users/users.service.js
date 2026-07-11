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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = require("bcryptjs");
const users_repository_1 = require("./repositories/users.repository");
const user_record_1 = require("./types/user-record");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        const users = await this.usersRepository.findAll();
        return users.map(user_record_1.toPublicUser);
    }
    async findByEmail(email) {
        return this.usersRepository.findByEmail(email);
    }
    async findPublicById(id) {
        const user = await this.usersRepository.findById(id);
        return user ? (0, user_record_1.toPublicUser)(user) : null;
    }
    async create(data) {
        const existing = await this.usersRepository.findByEmail(data.email);
        if (existing) {
            throw new common_1.ConflictException('Email already in use');
        }
        const passwordHash = await (0, bcryptjs_1.hash)(data.password, 12);
        const user = await this.usersRepository.create({
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role,
            tenantId: data.tenantId
        });
        return (0, user_record_1.toPublicUser)(user);
    }
    async update(id, data) {
        if (data.email) {
            const existing = await this.usersRepository.findByEmail(data.email);
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        const passwordHash = data.password ? await (0, bcryptjs_1.hash)(data.password, 12) : undefined;
        const user = await this.usersRepository.update(id, {
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role
        });
        return (0, user_record_1.toPublicUser)(user);
    }
    async remove(id) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.usersRepository.delete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
