import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TenantContextService } from '../tenants/tenant-context.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService, private readonly tenantContext: TenantContextService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER', 'ADMIN', 'CHEF')
    findAll(@Query() query: FindOrdersQueryDto) {
        return this.ordersService.findAll(query.status);
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateOrderDto) {
        const tenant = this.tenantContext.current();
        if (!tenant || !['TRIAL', 'ACTIVE', 'PAST_DUE'].includes(tenant.status)) throw new ForbiddenException('Restaurant is unavailable');
        return this.ordersService.create(dto);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER', 'ADMIN', 'CHEF')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateOrderStatusDto
    ) {
        return this.ordersService.updateStatus(id, dto.status);
    }
}
