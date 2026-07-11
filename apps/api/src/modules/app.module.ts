import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './common/health/health.module';
import { DatabaseModule } from './database/database.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { PublicModule } from './public/public.module';
import { RealtimeModule } from './realtime/realtime.module';
import { SettingsModule } from './settings/settings.module';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { PlatformModule } from './platform/platform.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    TenantsModule,
    PlatformModule,
    BillingModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    MenuItemsModule,
    OrdersModule,
    TablesModule,
    DashboardModule,
    SettingsModule,
    PublicModule,
    RealtimeModule,
    HealthModule
  ]
})
export class AppModule { }
