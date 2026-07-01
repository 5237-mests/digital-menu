import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './repositories/categories.repository';
import type { CategoryDto } from './types/category-record';
import { toCategoryDto } from './types/category-record';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    async findAll(includeInactive = false): Promise<CategoryDto[]> {
        const rows = await this.categoriesRepository.findAll(includeInactive);
        return rows.map(toCategoryDto);
    }

    async findById(id: number, includeInactive = false): Promise<CategoryDto> {
        const row = await this.categoriesRepository.findById(id, includeInactive);
        if (!row) {
            throw new NotFoundException('Category not found');
        }
        return toCategoryDto(row);
    }

    async create(data: {
        name: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryDto> {
        const row = await this.categoriesRepository.create(data);
        return toCategoryDto(row);
    }

    async update(id: number, data: {
        name?: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryDto> {
        const row = await this.categoriesRepository.update(id, data);
        return toCategoryDto(row);
    }

    async remove(id: number): Promise<void> {
        await this.categoriesRepository.delete(id);
    }
}
