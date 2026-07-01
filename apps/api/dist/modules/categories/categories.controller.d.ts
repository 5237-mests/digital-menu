import type { AuthenticatedUser } from '../auth/types/auth.types';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { CategoryDto } from './types/category-record';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(user?: AuthenticatedUser): Promise<CategoryDto[]>;
    findById(id: number, user?: AuthenticatedUser): Promise<CategoryDto>;
    create(dto: CreateCategoryDto): Promise<CategoryDto>;
    update(id: number, dto: UpdateCategoryDto): Promise<CategoryDto>;
    remove(id: number): Promise<{
        readonly success: true;
    }>;
}
