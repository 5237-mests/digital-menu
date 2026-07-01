import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdateTableDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    tableNumber?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    qrCode?: string;

    @IsOptional()
    @IsEnum(['AVAILABLE', 'OCCUPIED', 'DISABLED'])
    status?: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
}
