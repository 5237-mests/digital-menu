"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const health_module_1 = require("./common/health/health.module");
const database_module_1 = require("./database/database.module");
const menu_items_module_1 = require("./menu-items/menu-items.module");
const orders_module_1 = require("./orders/orders.module");
const public_module_1 = require("./public/public.module");
const realtime_module_1 = require("./realtime/realtime.module");
const settings_module_1 = require("./settings/settings.module");
const tables_module_1 = require("./tables/tables.module");
const users_module_1 = require("./users/users.module");
const tenants_module_1 = require("./tenants/tenants.module");
const platform_module_1 = require("./platform/platform.module");
const billing_module_1 = require("./billing/billing.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            database_module_1.DatabaseModule,
            tenants_module_1.TenantsModule,
            platform_module_1.PlatformModule,
            billing_module_1.BillingModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            menu_items_module_1.MenuItemsModule,
            orders_module_1.OrdersModule,
            tables_module_1.TablesModule,
            dashboard_module_1.DashboardModule,
            settings_module_1.SettingsModule,
            public_module_1.PublicModule,
            realtime_module_1.RealtimeModule,
            health_module_1.HealthModule
        ]
    })
], AppModule);
