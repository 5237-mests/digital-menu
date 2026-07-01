import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';
import type { TableDto } from './types/table-record';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll(): Promise<TableDto[]> {
        return this.tablesService.findAll();
    }

    @Get('by-qr/:qrCode')
    findByQrCode(@Param('qrCode') qrCode: string): Promise<TableDto> {
        return this.tablesService.findByQrCode(qrCode);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findById(@Param('id', ParseIntPipe) id: number): Promise<TableDto> {
        return this.tablesService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateTableDto): Promise<TableDto> {
        return this.tablesService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTableDto
    ): Promise<TableDto> {
        return this.tablesService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number): Promise<{ readonly success: true }> {
        return this.tablesService.remove(id).then(() => ({ success: true }));
    }
}
