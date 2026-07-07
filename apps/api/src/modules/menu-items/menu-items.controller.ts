// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
// import { OptionalCurrentUser } from '../auth/decorators/optional-current-user.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import type { AuthenticatedUser } from '../auth/types/auth.types';
// import { CreateMenuItemDto } from './dto/create-menu-item.dto';
// import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
// import { MenuItemsService } from './menu-items.service';
// import type { MenuItemDto } from './types/menu-item-record';

// import { diskStorage } from 'multer';

// @Controller('menu-items')
// export class MenuItemsController {
//     constructor(private readonly menuItemsService: MenuItemsService) { }

//     @Get()
//     @UseGuards(OptionalJwtAuthGuard)
//     findAll(@OptionalCurrentUser() user?: AuthenticatedUser): Promise<MenuItemDto[]> {
//         const includeUnavailable = user?.role === 'ADMIN';
//         return this.menuItemsService.findAll(includeUnavailable);
//     }

//     @Get(':id')
//     @UseGuards(OptionalJwtAuthGuard)
//     findById(
//         @Param('id', ParseIntPipe) id: number,
//         @OptionalCurrentUser() user?: AuthenticatedUser
//     ): Promise<MenuItemDto> {
//         const includeUnavailable = user?.role === 'ADMIN';
//         return this.menuItemsService.findById(id, includeUnavailable);
//     }

//     @Post()
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles('ADMIN')
//     create(@Body() dto: CreateMenuItemDto): Promise<MenuItemDto> {
//         return this.menuItemsService.create(dto);
//     }

//     @Put(':id')
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles('ADMIN')
//     update(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() dto: UpdateMenuItemDto
//     ): Promise<MenuItemDto> {
//         return this.menuItemsService.update(id, dto);
//     }

//     @Delete(':id')
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles('ADMIN')
//     remove(@Param('id', ParseIntPipe) id: number): Promise<{ readonly success: true }> {
//         return this.menuItemsService.remove(id).then(() => ({ success: true }));
//     }
// }



import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// import { extname, join } from 'node:path';
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


import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// 1. Resolve path relative to where the server process is currently running
const uploadRoot = join(process.cwd(), 'uploads', 'products');

const storage = diskStorage({
    // 2. Change string to a function to handle folder checks before saving
    destination: (_req, _file, callback) => {
        try {
            // 3. Create the complete directory structure recursively if missing
            if (!existsSync(uploadRoot)) {
                mkdirSync(uploadRoot, { recursive: true });
            }
            callback(null, uploadRoot);
        } catch (error) {
            callback(new Error('Failed to create upload directory'), 'null'); // Pass the error safely to Multer instead of crashing
        }
    },
    filename: (_req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e2)}`;
        callback(null, uniqueSuffix + extname(file.originalname).toLowerCase());
    },
});

// ====================== MULTER CONFIG (Matching Express) ======================

// const storage = diskStorage({
//     destination: uploadRoot,
//     filename: (_req, file, callback) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e2)}`;
//         callback(null, uniqueSuffix + extname(file.originalname).toLowerCase());
//     },
// });

// const imageFileFilter = (_req: any, file: Express.Multer.File, callback: any) => {
//     if (file.mimetype.startsWith('image/')) {
//         callback(null, true);
//     } else {
//         callback(new Error('Only image files are allowed'), false);
//     }
// };

// const uploadOptions = {
//     storage,
//     fileFilter: imageFileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// };

// ====================== CONTROLLER ======================
@Controller('menu-items')
export class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    findAll(@OptionalCurrentUser() user?: AuthenticatedUser) {
        const includeUnavailable = user?.role === 'ADMIN';
        return this.menuItemsService.findAll(includeUnavailable);
    }

    @Get(':id')
    @UseGuards(OptionalJwtAuthGuard)
    findById(@Param('id', ParseIntPipe) id: number, @OptionalCurrentUser() user?: AuthenticatedUser) {
        const includeUnavailable = user?.role === 'ADMIN';
        return this.menuItemsService.findById(id, includeUnavailable);
    }

    // @Post()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('ADMIN')
    // @UseInterceptors(FileInterceptor('image', uploadOptions))
    // async create(
    //     @UploadedFile() file: Express.Multer.File | undefined,
    //     @Body() dto: CreateMenuItemDto,
    // ): Promise<MenuItemDto> {
    //     try {
    //         if (file) {
    //             dto.image = `/uploads/${file.filename}`;
    //         }
    //         return await this.menuItemsService.create(dto);
    //     } catch (error) {
    //         if (file) {
    //             // Optional: cleanup file if service fails
    //         }
    //         throw error;
    //     }
    // }

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
        @Body() dto: UpdateMenuItemDto,
    ): Promise<MenuItemDto> {
        return this.menuItemsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.menuItemsService.remove(id).then(() => ({ success: true }));
    }
}



// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname, join } from 'node:path';
// import { OptionalCurrentUser } from '../auth/decorators/optional-current-user.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import type { AuthenticatedUser } from '../auth/types/auth.types';
// import { CreateMenuItemDto } from './dto/create-menu-item.dto';
// import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
// import { MenuItemsService } from './menu-items.service';
// import type { MenuItemDto } from './types/menu-item-record';

// @Controller('menu-items')
// export class MenuItemsController {
//     constructor(private readonly menuItemsService: MenuItemsService) { }

//     private getUploadOptions() {
//         const homeDir = process.env.HOME || '/home/hypertxj';
//         const uploadRoot = join(homeDir, 'uploads', 'products');

//         return {
//             storage: diskStorage({
//                 destination: uploadRoot,
//                 filename: (_req, file, callback) => {
//                     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//                     callback(null, uniqueSuffix + extname(file.originalname).toLowerCase());
//                 },
//             }),
//             limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//         };
//     }

//     @Get()
//     @UseGuards(OptionalJwtAuthGuard)
//     findAll(@OptionalCurrentUser() user?: AuthenticatedUser) {
//         const includeUnavailable = user?.role === 'ADMIN';
//         return this.menuItemsService.findAll(includeUnavailable);
//     }

//     @Get(':id')
//     @UseGuards(OptionalJwtAuthGuard)
//     findById(@Param('id', ParseIntPipe) id: number, @OptionalCurrentUser() user?: AuthenticatedUser) {
//         const includeUnavailable = user?.role === 'ADMIN';
//         return this.menuItemsService.findById(id, includeUnavailable);
//     }

//     @Post()
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles('ADMIN')
//     @UseInterceptors(FileInterceptor('image', /* will be passed dynamically */))
//     async create(
//         @UploadedFile() file: Express.Multer.File | undefined,
//         @Body() dto: CreateMenuItemDto,
//     ): Promise<MenuItemDto> {
//         if (file) {
//             dto.image = `/uploads/${file.filename}`;
//         }
//         return this.menuItemsService.create(dto);
//     }

//     @Put(':id')
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles('ADMIN')
//     update(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() dto: UpdateMenuItemDto,
//     ): Promise<MenuItemDto> {
//         return this.menuItemsService.update(id, dto);
//     }

//     @Delete(':id')
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles('ADMIN')
//     remove(@Param('id', ParseIntPipe) id: number) {
//         return this.menuItemsService.remove(id).then(() => ({ success: true }));
//     }
// }
