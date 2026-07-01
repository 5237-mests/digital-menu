"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const orders_repository_1 = require("./repositories/orders.repository");
const order_item_record_1 = require("./types/order-item-record");
const order_record_1 = require("./types/order-record");
let OrdersService = class OrdersService {
    ordersRepository;
    realtimeGateway;
    constructor(ordersRepository, realtimeGateway) {
        this.ordersRepository = ordersRepository;
        this.realtimeGateway = realtimeGateway;
    }
    async findAll(status) {
        const rows = await this.ordersRepository.findAll(status);
        return rows.map(order_record_1.toOrderDto);
    }
    async findById(id) {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const items = await this.ordersRepository.findItemsByOrderId(id);
        const estimatedPrepTime = await this.ordersRepository.estimatePrepTimeForOrder(id);
        return {
            order: (0, order_record_1.toOrderDto)(order),
            items: items.map(order_item_record_1.toOrderItemDto),
            estimatedPrepTime
        };
    }
    async create(data) {
        const resolvedItems = await this.ordersRepository.resolveMenuItems(data.items);
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const order = await this.ordersRepository.createOrder(orderNumber, data.tableId, resolvedItems);
        const items = await this.ordersRepository.findItemsByOrderId(order.id);
        const response = {
            order: (0, order_record_1.toOrderDto)(order),
            items: items.map(order_item_record_1.toOrderItemDto),
            estimatedPrepTime: resolvedItems.reduce((max, item) => Math.max(max, item.preparationTime), 0)
        };
        this.realtimeGateway.emitOrderCreated(response);
        return response;
    }
    async updateStatus(id, status) {
        const order = await this.ordersRepository.updateStatus(id, status);
        const items = await this.ordersRepository.findItemsByOrderId(id);
        const response = {
            order: (0, order_record_1.toOrderDto)(order),
            items: items.map(order_item_record_1.toOrderItemDto),
            estimatedPrepTime: await this.ordersRepository.estimatePrepTimeForOrder(id)
        };
        this.realtimeGateway.emitOrderUpdated(response);
        return response;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        realtime_gateway_1.RealtimeGateway])
], OrdersService);
