"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../database/database.module");
const users_module_1 = require("../users/users.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("./guards/optional-jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const refresh_tokens_repository_1 = require("./repositories/refresh-tokens.repository");
// @Module({
//   imports: [DatabaseModule, UsersModule, JwtModule.register({})],
//   controllers: [AuthController],
//   providers: [AuthService, RefreshTokensRepository, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard],
//   exports: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard]
// })
// export class AuthModule {}
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            jwt_1.JwtModule.register({}),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            refresh_tokens_repository_1.RefreshTokensRepository,
            jwt_auth_guard_1.JwtAuthGuard,
            optional_jwt_auth_guard_1.OptionalJwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [
            auth_service_1.AuthService,
            jwt_auth_guard_1.JwtAuthGuard,
            optional_jwt_auth_guard_1.OptionalJwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
    })
], AuthModule);
