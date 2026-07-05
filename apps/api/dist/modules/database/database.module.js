"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const promise_1 = require("mysql2/promise");
const database_constants_1 = require("./database.constants");
const database_service_1 = require("./database.service");
const mysql_pool_config_1 = require("./mysql-pool.config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: database_constants_1.MYSQL_POOL,
                // useFactory: () => createPool(buildMysqlPoolConfig())
                useFactory: async () => {
                    const pool = (0, promise_1.createPool)((0, mysql_pool_config_1.buildMysqlPoolConfig)());
                    try {
                        await pool.query('SELECT 1');
                        console.log('[DB] Connected successfully');
                        return pool;
                    }
                    catch (error) {
                        console.error('[DB] Connection failed:', error);
                        throw error;
                    }
                }
            },
            database_service_1.DatabaseService
        ],
        exports: [database_constants_1.MYSQL_POOL, database_service_1.DatabaseService]
    })
], DatabaseModule);
