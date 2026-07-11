import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
@Module({ imports: [DatabaseModule, AuthModule], controllers: [BillingController] }) export class BillingModule {}
