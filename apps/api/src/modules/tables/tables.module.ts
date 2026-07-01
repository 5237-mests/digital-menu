import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { TablesController } from './tables.controller';
import { TablesRepository } from './repositories/tables.repository';
import { TablesService } from './tables.service';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [TablesController],
    providers: [TablesRepository, TablesService],
    exports: [TablesRepository, TablesService]
})
export class TablesModule { }
