"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextService = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const common_1 = require("@nestjs/common");
let TenantContextService = class TenantContextService {
    storage = new node_async_hooks_1.AsyncLocalStorage();
    run(context, next) { this.storage.run(context, next); }
    current() { return this.storage.getStore(); }
    requireId() { const tenant = this.current(); if (!tenant)
        throw new common_1.UnauthorizedException('Tenant context is required'); return tenant.id; }
};
exports.TenantContextService = TenantContextService;
exports.TenantContextService = TenantContextService = __decorate([
    (0, common_1.Injectable)()
], TenantContextService);
