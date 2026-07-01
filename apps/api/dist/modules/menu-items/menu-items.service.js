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
exports.MenuItemsService = void 0;
const common_1 = require("@nestjs/common");
const menu_items_repository_1 = require("./repositories/menu-items.repository");
const menu_item_record_1 = require("./types/menu-item-record");
let MenuItemsService = class MenuItemsService {
    menuItemsRepository;
    constructor(menuItemsRepository) {
        this.menuItemsRepository = menuItemsRepository;
    }
    async findAll(includeUnavailable = false) {
        const rows = await this.menuItemsRepository.findAll(includeUnavailable);
        return rows.map(menu_item_record_1.toMenuItemDto);
    }
    async findById(id, includeUnavailable = false) {
        const row = await this.menuItemsRepository.findById(id, includeUnavailable);
        if (!row) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        return (0, menu_item_record_1.toMenuItemDto)(row);
    }
    async create(data) {
        const row = await this.menuItemsRepository.create(data);
        return (0, menu_item_record_1.toMenuItemDto)(row);
    }
    async update(id, data) {
        const row = await this.menuItemsRepository.update(id, data);
        return (0, menu_item_record_1.toMenuItemDto)(row);
    }
    async remove(id) {
        await this.menuItemsRepository.delete(id);
    }
};
exports.MenuItemsService = MenuItemsService;
exports.MenuItemsService = MenuItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [menu_items_repository_1.MenuItemsRepository])
], MenuItemsService);
