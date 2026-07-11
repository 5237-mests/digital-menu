import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    private readonly tenantContext;
    constructor(ordersService: OrdersService, tenantContext: TenantContextService);
    findAll(query: FindOrdersQueryDto): Promise<import("./types").OrderDto[]>;
    findById(id: number): Promise<import("./types/order-detail-response").OrderDetailResponse>;
    create(dto: CreateOrderDto): Promise<import("./types/order-detail-response").OrderDetailResponse>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<import("./types/order-detail-response").OrderDetailResponse>;
}
