import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { MenuItemsModule } from '../menu-items/menu-items.module';
import { TablesModule } from '../tables/tables.module';
import { PublicController } from './public.controller';

@Module({
  imports: [TablesModule, CategoriesModule, MenuItemsModule],
  controllers: [PublicController]
})
export class PublicModule {}
