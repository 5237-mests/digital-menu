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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const REALTIME_EVENTS = {
    orderCreated: 'order.created',
    orderUpdated: 'order.updated',
    orderDelivered: 'order.delivered',
    kitchenQueueUpdated: 'kitchen.queue.updated'
};
let RealtimeGateway = class RealtimeGateway {
    server;
    joinTenant(socket, tenantId) { socket.join(`tenant:${tenantId}`); }
    emitOrderCreated(tenantId, payload) {
        this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.orderCreated, payload);
        this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.kitchenQueueUpdated);
    }
    emitOrderUpdated(tenantId, payload) {
        this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.orderUpdated, payload);
        this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.kitchenQueueUpdated);
        if (payload.order.status === 'DELIVERED') {
            this.server.to(`tenant:${tenantId}`).emit(REALTIME_EVENTS.orderDelivered, payload);
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('tenant.join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Number]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "joinTenant", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true
        }
    })
], RealtimeGateway);
