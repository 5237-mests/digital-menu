"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemsController = void 0;
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
const common_1 = require("@nestjs/common");
// import { extname, join } from 'node:path';
const optional_current_user_decorator_1 = require("../auth/decorators/optional-current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const create_menu_item_dto_1 = require("./dto/create-menu-item.dto");
const update_menu_item_dto_1 = require("./dto/update-menu-item.dto");
const menu_items_service_1 = require("./menu-items.service");
const path_1 = require("path");
// 1. Resolve path relative to where the server process is currently running
const uploadRoot = (0, path_1.join)(process.cwd(), 'uploads', 'products');
console.log('Upload root directory:', uploadRoot);
// const storage = diskStorage({
//     // 2. Change string to a function to handle folder checks before saving
//     destination: (_req, _file, callback) => {
//         try {
//             // 3. Create the complete directory structure recursively if missing
//             if (!existsSync(uploadRoot)) {
//                 mkdirSync(uploadRoot, { recursive: true });
//             }
//             callback(null, uploadRoot);
//         } catch (error) {
//             callback(new Error('Failed to create upload directory'), 'null'); // Pass the error safely to Multer instead of crashing
//         }
//     },
//     filename: (_req, file, callback) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e2)}`;
//         callback(null, uniqueSuffix + extname(file.originalname).toLowerCase());
//     },
// });
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
let MenuItemsController = class MenuItemsController {
    menuItemsService;
    constructor(menuItemsService) {
        this.menuItemsService = menuItemsService;
    }
    findAll(user) {
        const includeUnavailable = user?.role === 'ADMIN';
        return this.menuItemsService.findAll(includeUnavailable);
    }
    findById(id, user) {
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
    create(dto) {
        return this.menuItemsService.create(dto);
    }
    update(id, dto) {
        return this.menuItemsService.update(id, dto);
    }
    remove(id) {
        return this.menuItemsService.remove(id).then(() => ({ success: true }));
    }
};
exports.MenuItemsController = MenuItemsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, optional_current_user_decorator_1.OptionalCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MenuItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, optional_current_user_decorator_1.OptionalCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MenuItemsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_menu_item_dto_1.UpdateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenuItemsController.prototype, "remove", null);
exports.MenuItemsController = MenuItemsController = __decorate([
    (0, common_1.Controller)('menu-items'),
    __metadata("design:paramtypes", [menu_items_service_1.MenuItemsService])
], MenuItemsController);
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
