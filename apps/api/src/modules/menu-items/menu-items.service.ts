import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuItemsRepository } from './repositories/menu-items.repository';
import type { MenuItemDto } from './types/menu-item-record';
import { toMenuItemDto } from './types/menu-item-record';

@Injectable()
export class MenuItemsService {
    constructor(private readonly menuItemsRepository: MenuItemsRepository) { }

    async findAll(includeUnavailable = false): Promise<MenuItemDto[]> {
        const rows = await this.menuItemsRepository.findAll(includeUnavailable);
        return rows.map(toMenuItemDto);
    }

    async findById(id: number, includeUnavailable = false): Promise<MenuItemDto> {
        const row = await this.menuItemsRepository.findById(id, includeUnavailable);
        if (!row) {
            throw new NotFoundException('Menu item not found');
        }
        return toMenuItemDto(row);
    }

    async create(data: {
        categoryId: number;
        name: string;
        description?: string;
        image?: string;
        price: string;
        preparationTime: number;
        isAvailable?: boolean;
    }): Promise<MenuItemDto> {
        const row = await this.menuItemsRepository.create(data);
        return toMenuItemDto(row);
    }

    async update(id: number, data: {
        categoryId?: number;
        name?: string;
        description?: string;
        image?: string;
        price?: string;
        preparationTime?: number;
        isAvailable?: boolean;
    }): Promise<MenuItemDto> {
        const row = await this.menuItemsRepository.update(id, data);
        return toMenuItemDto(row);
    }

    async remove(id: number): Promise<void> {
        await this.menuItemsRepository.delete(id);
    }
}
