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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const categories_repository_1 = require("./repositories/categories.repository");
const category_record_1 = require("./types/category-record");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async findAll(includeInactive = false) {
        const rows = await this.categoriesRepository.findAll(includeInactive);
        return rows.map(category_record_1.toCategoryDto);
    }
    async findById(id, includeInactive = false) {
        const row = await this.categoriesRepository.findById(id, includeInactive);
        if (!row) {
            throw new common_1.NotFoundException('Category not found');
        }
        return (0, category_record_1.toCategoryDto)(row);
    }
    async create(data) {
        const row = await this.categoriesRepository.create(data);
        return (0, category_record_1.toCategoryDto)(row);
    }
    async update(id, data) {
        const row = await this.categoriesRepository.update(id, data);
        return (0, category_record_1.toCategoryDto)(row);
    }
    async remove(id) {
        await this.categoriesRepository.delete(id);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categories_repository_1.CategoriesRepository])
], CategoriesService);
