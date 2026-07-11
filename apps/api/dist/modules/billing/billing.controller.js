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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const common_2 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const tenant_context_service_1 = require("../tenants/tenant-context.service");
/** Provider boundary: Chapa checkout initialization/verification can be enabled without changing subscription logic. */
let BillingController = class BillingController {
    pool;
    tenantContext;
    constructor(pool, tenantContext) {
        this.pool = pool;
        this.tenantContext = tenantContext;
    }
    async chapaWebhook(xSignature, chapaSignature, payload) {
        const secret = process.env.CHAPA_WEBHOOK_SECRET;
        const signature = xSignature ?? chapaSignature;
        if (!secret || !signature)
            throw new common_1.ForbiddenException('Invalid Chapa signature');
        const expected = (0, node_crypto_1.createHmac)('sha256', secret).update(JSON.stringify(payload)).digest('hex');
        if (signature !== expected)
            throw new common_1.ForbiddenException('Invalid Chapa signature');
        const eventKey = String(payload.reference ?? payload.tx_ref ?? '');
        if (!eventKey)
            throw new common_1.ForbiddenException('Missing Chapa reference');
        const [result] = await this.pool.execute('INSERT IGNORE INTO billing_webhook_events (provider, event_key, payload, processed_at) VALUES (\'chapa\', ?, ?, NOW())', [eventKey, JSON.stringify(payload)]);
        return { received: true, duplicate: Number(result.affectedRows) === 0 };
    }
    async renewalIntent() {
        const tenantId = this.tenantContext.requireId();
        // Automatic recurring Chapa charges remain disabled until merchant capability is confirmed.
        return { tenantId, provider: 'chapa', recurringEnabled: process.env.CHAPA_RECURRING_ENABLED === 'true', status: 'provider_configuration_required' };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('webhooks/chapa'),
    __param(0, (0, common_1.Headers)('x-chapa-signature')),
    __param(1, (0, common_1.Headers)('chapa-signature')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "chapaWebhook", null);
__decorate([
    (0, common_1.Post)('renewal/intent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "renewalIntent", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    __param(0, (0, common_2.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object, tenant_context_service_1.TenantContextService])
], BillingController);
