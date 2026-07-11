import { Global, Module } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantsService } from './tenants.service';
import { DatabaseModule } from '../database/database.module';

@Global() @Module({ imports: [DatabaseModule], providers: [TenantContextService, TenantsService], exports: [TenantContextService, TenantsService] })
export class TenantsModule {}
