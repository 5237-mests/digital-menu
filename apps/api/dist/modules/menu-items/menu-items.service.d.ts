import { MenuItemsRepository } from './repositories/menu-items.repository';
import type { MenuItemDto } from './types/menu-item-record';
export declare class MenuItemsService {
    private readonly menuItemsRepository;
    constructor(menuItemsRepository: MenuItemsRepository);
    findAll(includeUnavailable?: boolean): Promise<MenuItemDto[]>;
    findById(id: number, includeUnavailable?: boolean): Promise<MenuItemDto>;
    create(data: {
        categoryId: number;
        name: string;
        description?: string;
        image?: string;
        price: string;
        preparationTime: number;
        isAvailable?: boolean;
    }): Promise<MenuItemDto>;
    update(id: number, data: {
        categoryId?: number;
        name?: string;
        description?: string;
        image?: string;
        price?: string;
        preparationTime?: number;
        isAvailable?: boolean;
    }): Promise<MenuItemDto>;
    remove(id: number): Promise<void>;
}
