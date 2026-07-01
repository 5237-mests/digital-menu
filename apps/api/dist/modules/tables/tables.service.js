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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const tables_repository_1 = require("./repositories/tables.repository");
const table_record_1 = require("./types/table-record");
let TablesService = class TablesService {
    tablesRepository;
    constructor(tablesRepository) {
        this.tablesRepository = tablesRepository;
    }
    async findAll() {
        const rows = await this.tablesRepository.findAll();
        return rows.map(table_record_1.toTableDto);
    }
    async findById(id) {
        const row = await this.tablesRepository.findById(id);
        if (!row) {
            throw new common_1.NotFoundException('Table not found');
        }
        return (0, table_record_1.toTableDto)(row);
    }
    async findByQrCode(qrCode) {
        const row = await this.tablesRepository.findByQrCode(qrCode);
        if (!row) {
            throw new common_1.NotFoundException('Table not found');
        }
        if (row.status === 'DISABLED') {
            throw new common_1.BadRequestException('Table is not available for ordering');
        }
        return (0, table_record_1.toTableDto)(row);
    }
    async create(data) {
        const qrCode = data.qrCode ?? `table-${data.tableNumber}`;
        const row = await this.tablesRepository.create({
            tableNumber: data.tableNumber,
            qrCode,
            status: data.status
        });
        return (0, table_record_1.toTableDto)(row);
    }
    async update(id, data) {
        const row = await this.tablesRepository.update(id, data);
        return (0, table_record_1.toTableDto)(row);
    }
    async remove(id) {
        await this.tablesRepository.delete(id);
    }
    async setStatus(id, status) {
        await this.tablesRepository.updateStatus(id, status);
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tables_repository_1.TablesRepository])
], TablesService);
