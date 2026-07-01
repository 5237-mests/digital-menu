import { TablesRepository } from './repositories/tables.repository';
import type { TableDto } from './types/table-record';
export declare class TablesService {
    private readonly tablesRepository;
    constructor(tablesRepository: TablesRepository);
    findAll(): Promise<TableDto[]>;
    findById(id: number): Promise<TableDto>;
    findByQrCode(qrCode: string): Promise<TableDto>;
    create(data: {
        tableNumber: number;
        qrCode?: string;
        status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableDto>;
    update(id: number, data: {
        tableNumber?: number;
        qrCode?: string;
        status?: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
    }): Promise<TableDto>;
    remove(id: number): Promise<void>;
    setStatus(id: number, status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED'): Promise<void>;
}
