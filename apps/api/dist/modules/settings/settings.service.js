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
exports.SettingsService = exports.SettingsRepository = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const setting_record_1 = require("./types/setting-record");
let SettingsRepository = class SettingsRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const [rows] = await this.pool.execute(`
        SELECT id, setting_key, setting_value, updated_at
        FROM settings
        ORDER BY setting_key ASC
      `);
        return rows;
    }
    async upsert(key, value) {
        await this.pool.execute(`
        INSERT INTO settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
      `, [key, value]);
    }
};
exports.SettingsRepository = SettingsRepository;
exports.SettingsRepository = SettingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.MYSQL_POOL)),
    __metadata("design:paramtypes", [Object])
], SettingsRepository);
let SettingsService = class SettingsService {
    settingsRepository;
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }
    async getSettings() {
        const records = await this.settingsRepository.findAll();
        return (0, setting_record_1.recordsToSettingsDto)(records);
    }
    async updateSettings(data) {
        await this.settingsRepository.upsert('restaurant_name', data.restaurantName);
        await this.settingsRepository.upsert('currency', data.currency);
        await this.settingsRepository.upsert('tax_rate', data.taxRate);
        return this.getSettings();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [SettingsRepository])
], SettingsService);
