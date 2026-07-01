import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TablesRepository } from './repositories/tables.repository';
import type { TableDto } from './types/table-record';
import { toTableDto } from './types/table-record';

@Injectable()
export class TablesService {
    constructor(private readonly tablesRepository: TablesRepository) { }

    async findAll(): Promise<TableDto[]> {
        const rows = await this.tablesRepository.findAll();
        return rows.map(toTableDto);
    }

    async findById(id: number): Promise<TableDto> {
        const row = await this.tablesRepository.findById(id);
        if (!row) {
            throw new NotFoundException('Table not found');
        }
        return toTableDto(row);
    }

    async findByQrCode(qrCode: string): Promise<TableDto> {
        const row = await this.tablesRepository.findByQrCode(qrCode);
        if (!row) {
            throw new NotFoundException('Table not found');
        }
        if (row.status === 'DISABLED') {
            throw new BadRequestException('Table is not available for ordering');
        }
        return toTableDto(row);
    }

    async create(data: {
        tableNumber: number;
        qrCode?: string;
        status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableDto> {
        const qrCode = data.qrCode ?? `table-${data.tableNumber}`;
        const row = await this.tablesRepository.create({
            tableNumber: data.tableNumber,
            qrCode,
            status: data.status
        });
        return toTableDto(row);
    }

    async update(id: number, data: {
        tableNumber?: number;
        qrCode?: string;
        status?: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableDto> {
        const row = await this.tablesRepository.update(id, data);
        return toTableDto(row);
    }

    async remove(id: number): Promise<void> {
        await this.tablesRepository.delete(id);
    }

    async setStatus(id: number, status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED'): Promise<void> {
        await this.tablesRepository.updateStatus(id, status);
    }
}
