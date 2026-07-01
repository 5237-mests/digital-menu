import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateTableDto {
    @IsInt()
    @IsPositive()
    tableNumber!: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    qrCode?: string;

    @IsEnum(['AVAILABLE', 'OCCUPIED', 'DISABLED'])
    status!: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
}
