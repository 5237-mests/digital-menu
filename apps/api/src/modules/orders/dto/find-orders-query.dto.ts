import { IsEnum, IsOptional } from 'class-validator';
import type { OrderStatus } from '../types/order-record';

export class FindOrdersQueryDto {
    @IsOptional()
    @IsEnum(['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'])
    status?: OrderStatus;
}
