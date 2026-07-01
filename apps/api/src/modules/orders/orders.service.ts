import { Injectable, NotFoundException } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import type { NewOrderItemInput } from './repositories/orders.repository';
import { OrdersRepository } from './repositories/orders.repository';
import { toOrderItemDto } from './types/order-item-record';
import type { OrderDto, OrderStatus } from './types/order-record';
import { toOrderDto } from './types/order-record';
import type { OrderDetailResponse } from './types/order-detail-response';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly realtimeGateway: RealtimeGateway
    ) { }

    async findAll(status?: OrderStatus): Promise<OrderDto[]> {
        const rows = await this.ordersRepository.findAll(status);
        return rows.map(toOrderDto);
    }

    async findById(id: number): Promise<OrderDetailResponse> {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const items = await this.ordersRepository.findItemsByOrderId(id);
        const estimatedPrepTime = await this.ordersRepository.estimatePrepTimeForOrder(id);

        return {
            order: toOrderDto(order),
            items: items.map(toOrderItemDto),
            estimatedPrepTime
        };
    }

    async create(data: {
        tableId: number;
        items: NewOrderItemInput[];
    }): Promise<OrderDetailResponse> {
        const resolvedItems = await this.ordersRepository.resolveMenuItems(data.items);
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const order = await this.ordersRepository.createOrder(orderNumber, data.tableId, resolvedItems);
        const items = await this.ordersRepository.findItemsByOrderId(order.id);
        const response = {
            order: toOrderDto(order),
            items: items.map(toOrderItemDto),
            estimatedPrepTime: resolvedItems.reduce((max, item) => Math.max(max, item.preparationTime), 0)
        };

        this.realtimeGateway.emitOrderCreated(response);
        return response;
    }

    async updateStatus(id: number, status: OrderStatus): Promise<OrderDetailResponse> {
        const order = await this.ordersRepository.updateStatus(id, status);
        const items = await this.ordersRepository.findItemsByOrderId(id);
        const response = {
            order: toOrderDto(order),
            items: items.map(toOrderItemDto),
            estimatedPrepTime: await this.ordersRepository.estimatePrepTimeForOrder(id)
        };

        this.realtimeGateway.emitOrderUpdated(response);
        return response;
    }
}
