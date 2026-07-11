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
exports.PlatformController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const users_service_1 = require("../users/users.service");
const tenants_service_1 = require("../tenants/tenants.service");
let PlatformController = class PlatformController {
    tenants;
    users;
    constructor(tenants, users) {
        this.tenants = tenants;
        this.users = users;
    }
    setupInstructions() {
        return {
            message: 'Create the initial platform administrator with POST /setup/platform-admin.',
            requiredHeaders: ['Content-Type: application/json', 'X-Setup-Secret: <PLATFORM_SETUP_SECRET>'],
            requiredBody: { name: 'Platform Admin', email: 'admin@example.com', password: 'strong password' }
        };
    }
    async setup(secret, body) {
        console.log('Setup request received with secret:', secret);
        console.log('Environment PLATFORM_SETUP_SECRET:', process.env);
        if (!process.env.PLATFORM_SETUP_SECRET || secret !== process.env.PLATFORM_SETUP_SECRET)
            throw new common_1.UnauthorizedException('Invalid setup secret');
        if (await this.users.findByEmail(body.email))
            throw new common_1.ConflictException('Email already in use');
        return this.users.create({ ...body, role: 'PLATFORM_ADMIN', tenantId: null });
    }
    list() { return this.tenants.findAll(); }
    async provision(body) {
        const tenant = await this.tenants.create(body.name, body.slug.toLowerCase());
        const owner = await this.users.create({ name: body.ownerName, email: body.ownerEmail, password: body.ownerPassword, role: 'OWNER', tenantId: tenant.id });
        return { tenant, owner };
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Get)('setup/platform-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "setupInstructions", null);
__decorate([
    (0, common_1.Post)('setup/platform-admin'),
    __param(0, (0, common_1.Headers)('x-setup-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "setup", null);
__decorate([
    (0, common_1.Get)('platform/tenants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PLATFORM_ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('platform/tenants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PLATFORM_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "provision", null);
exports.PlatformController = PlatformController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService, users_service_1.UsersService])
], PlatformController);
