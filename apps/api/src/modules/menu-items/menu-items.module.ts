import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsRepository } from './repositories/menu-items.repository';
import { MenuItemsService } from './menu-items.service';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [MenuItemsController],
    providers: [MenuItemsRepository, MenuItemsService],
    exports: [MenuItemsRepository, MenuItemsService]
})
export class MenuItemsModule { }
