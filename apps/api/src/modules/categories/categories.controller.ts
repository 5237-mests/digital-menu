import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OptionalCurrentUser } from '../auth/decorators/optional-current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { CategoryDto } from './types/category-record';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    findAll(@OptionalCurrentUser() user?: AuthenticatedUser): Promise<CategoryDto[]> {
        const includeInactive = user?.role === 'ADMIN';
        return this.categoriesService.findAll(includeInactive);
    }

    @Get(':id')
    @UseGuards(OptionalJwtAuthGuard)
    findById(
        @Param('id', ParseIntPipe) id: number,
        @OptionalCurrentUser() user?: AuthenticatedUser
    ): Promise<CategoryDto> {
        const includeInactive = user?.role === 'ADMIN';
        return this.categoriesService.findById(id, includeInactive);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
        return this.categoriesService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryDto
    ): Promise<CategoryDto> {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number): Promise<{ readonly success: true }> {
        return this.categoriesService.remove(id).then(() => ({ success: true }));
    }
}
