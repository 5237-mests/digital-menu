import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
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

const uploadPath = join(__dirname, '..', '..', 'uploads');
if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
}

const storage = diskStorage({
    destination: uploadPath,
    filename: (_req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = extname(file.originalname).toLowerCase();
        callback(null, `menu-item-${uniqueSuffix}${extension}`);
    }
});

const imageFileFilter = (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.startsWith('image/')) {
        callback(new Error('Only image uploads are allowed'), false);
        return;
    }
    callback(null, true);
};

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
    @UseInterceptors(FileInterceptor('image', { storage, fileFilter: imageFileFilter }))
    create(
        @UploadedFile() file: Express.Multer.File | undefined,
        @Body() dto: CreateMenuItemDto
    ): Promise<MenuItemDto> {
        if (file) {
            dto.image = `/uploads/${file.filename}`;
        }
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
