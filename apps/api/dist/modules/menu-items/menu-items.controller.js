"use strict";
// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { existsSync, mkdirSync } from 'node:fs';
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
// const uploadPath = join(__dirname, '..', '..', 'uploads');
// if (!existsSync(uploadPath)) {
//     mkdirSync(uploadPath, { recursive: true });
// }
// const storage = diskStorage({
//     destination: uploadPath,
//     filename: (_req, file, callback) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         const extension = extname(file.originalname).toLowerCase();
//         callback(null, `menu-item-${uniqueSuffix}${extension}`);
//     }
// });
// const imageFileFilter = (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
//     if (!file.mimetype.startsWith('image/')) {
//         callback(new Error('Only image uploads are allowed'), false);
//         return;
//     }
//     callback(null, true);
// };
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
//     @UseInterceptors(FileInterceptor('image', { storage, fileFilter: imageFileFilter }))
//     create(
//         @UploadedFile() file: Express.Multer.File | undefined,
//         @Body() dto: CreateMenuItemDto
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
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const optional_current_user_decorator_1 = require("../auth/decorators/optional-current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const create_menu_item_dto_1 = require("./dto/create-menu-item.dto");
const update_menu_item_dto_1 = require("./dto/update-menu-item.dto");
const menu_items_service_1 = require("./menu-items.service");
// ====================== UPLOAD CONFIG ======================
const uploadRoot = (0, node_path_1.join)(process.cwd(), 'uploads'); // ← Better for cPanel
// Create uploads folder safely
try {
    if (!(0, node_fs_1.existsSync)(uploadRoot)) {
        (0, node_fs_1.mkdirSync)(uploadRoot, { recursive: true, mode: 0o755 });
        console.log('✅ Uploads folder created at:', uploadRoot);
    }
}
catch (err) {
    console.error('❌ Could not create uploads folder:', err.message);
}
const storage = (0, multer_1.diskStorage)({
    destination: uploadRoot,
    filename: (_req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = (0, node_path_1.extname)(file.originalname).toLowerCase();
        callback(null, `menu-item-${uniqueSuffix}${extension}`);
    },
});
const imageFileFilter = (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
const uploadOptions = {
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // ← 5MB limit (important for shared hosting)
    },
};
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
    create(file, dto) {
        if (file) {
            dto.image = `/uploads/${file.filename}`;
        }
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
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, optional_current_user_decorator_1.OptionalCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', uploadOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_menu_item_dto_1.CreateMenuItemDto]),
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
    __metadata("design:returntype", Promise)
], MenuItemsController.prototype, "remove", null);
exports.MenuItemsController = MenuItemsController = __decorate([
    (0, common_1.Controller)('menu-items'),
    __metadata("design:paramtypes", [menu_items_service_1.MenuItemsService])
], MenuItemsController);
