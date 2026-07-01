import { IsArray, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
    @IsInt()
    @IsPositive()
    menuItemId!: number;

    @IsInt()
    @IsPositive()
    quantity!: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class CreateOrderDto {
    @IsInt()
    @IsPositive()
    tableId!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items!: CreateOrderItemDto[];
}
