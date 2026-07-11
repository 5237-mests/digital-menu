import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TenantContextService } from '../tenants/tenant-context.service';
import type { NewOrderItemInput } from './repositories/orders.repository';
import { OrdersRepository } from './repositories/orders.repository';
import type { OrderDto, OrderStatus } from './types/order-record';
import type { OrderDetailResponse } from './types/order-detail-response';
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly realtimeGateway;
    private readonly tenantContext;
    constructor(ordersRepository: OrdersRepository, realtimeGateway: RealtimeGateway, tenantContext: TenantContextService);
    findAll(status?: OrderStatus): Promise<OrderDto[]>;
    findById(id: number): Promise<OrderDetailResponse>;
    create(data: {
        tableId: number;
        items: NewOrderItemInput[];
    }): Promise<OrderDetailResponse>;
    updateStatus(id: number, status: OrderStatus): Promise<OrderDetailResponse>;
}
