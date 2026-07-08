import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { OptionalCurrentUser } from '../auth/decorators/optional-current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/types/auth.types';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemsService } from './menu-items.service';
import type { MenuItemDto } from './types/menu-item-record';


@Controller('menu-items')
export class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    findAll(@OptionalCurrentUser() user?: AuthenticatedUser): Promise<MenuItemDto[]> {
        const includeUnavailable = user?.role === 'ADMIN';
        return this.menuItemsService.findAll(includeUnavailable);
    }

    @Get(':id')
    @UseGuards(OptionalJwtAuthGuard)
    findById(
        @Param('id', ParseIntPipe) id: number,
        @OptionalCurrentUser() user?: AuthenticatedUser
    ): Promise<MenuItemDto> {
        const includeUnavailable = user?.role === 'ADMIN';
        return this.menuItemsService.findById(id, includeUnavailable);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateMenuItemDto): Promise<MenuItemDto> {
        return this.menuItemsService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMenuItemDto
    ): Promise<MenuItemDto> {
        return this.menuItemsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number): Promise<{ readonly success: true }> {
        return this.menuItemsService.remove(id).then(() => ({ success: true }));
    }
}
