import { IsEnum, IsInt, IsPositive } from 'class-validator';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export class UpdateOrderStatusDto {
    @IsEnum(['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'])
    status!: OrderStatus;
}
