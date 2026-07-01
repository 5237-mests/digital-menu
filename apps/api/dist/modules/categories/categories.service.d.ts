import { CategoriesRepository } from './repositories/categories.repository';
import type { CategoryDto } from './types/category-record';
export declare class CategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: CategoriesRepository);
    findAll(includeInactive?: boolean): Promise<CategoryDto[]>;
    findById(id: number, includeInactive?: boolean): Promise<CategoryDto>;
    create(data: {
        name: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryDto>;
    update(id: number, data: {
        name?: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<CategoryDto>;
    remove(id: number): Promise<void>;
}
