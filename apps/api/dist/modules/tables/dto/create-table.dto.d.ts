export declare class CreateTableDto {
    tableNumber: number;
    qrCode?: string;
    status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
}
