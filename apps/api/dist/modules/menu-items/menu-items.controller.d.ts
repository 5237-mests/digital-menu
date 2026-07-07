import type { AuthenticatedUser } from '../auth/types/auth.types';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemsService } from './menu-items.service';
import type { MenuItemDto } from './types/menu-item-record';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    findAll(user?: AuthenticatedUser): Promise<MenuItemDto[]>;
    findById(id: number, user?: AuthenticatedUser): Promise<MenuItemDto>;
    create(dto: CreateMenuItemDto): Promise<MenuItemDto>;
    update(id: number, dto: UpdateMenuItemDto): Promise<MenuItemDto>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
