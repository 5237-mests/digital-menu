import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.repository';
import { OrdersService } from './orders.service';

@Module({
    imports: [DatabaseModule, AuthModule, RealtimeModule],
    controllers: [OrdersController],
    providers: [OrdersRepository, OrdersService],
    exports: [OrdersRepository, OrdersService]
})
export class OrdersModule { }
