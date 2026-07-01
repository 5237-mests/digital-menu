import { IsBoolean, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateMenuItemDto {
    @IsInt()
    @IsPositive()
    categoryId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    image?: string;

    @IsNumberString()
    price!: string;

    @IsInt()
    @Min(0)
    preparationTime!: number;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
