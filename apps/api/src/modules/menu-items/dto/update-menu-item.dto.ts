import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class UpdateMenuItemDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    categoryId?: number;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    image?: string;

    @IsOptional()
    @IsNumberString()
    price?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    preparationTime?: number;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
