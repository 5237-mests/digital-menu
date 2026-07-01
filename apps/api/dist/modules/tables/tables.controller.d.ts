import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';
import type { TableDto } from './types/table-record';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    findAll(): Promise<TableDto[]>;
    findByQrCode(qrCode: string): Promise<TableDto>;
    findById(id: number): Promise<TableDto>;
    create(dto: CreateTableDto): Promise<TableDto>;
    update(id: number, dto: UpdateTableDto): Promise<TableDto>;
    remove(id: number): Promise<{
        readonly success: true;
    }>;
}
