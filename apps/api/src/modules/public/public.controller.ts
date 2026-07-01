import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { TablesService } from '../tables/tables.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly categoriesService: CategoriesService,
    private readonly menuItemsService: MenuItemsService
  ) {}

  @Get('menu/:qrCode')
  async getMenu(@Param('qrCode') qrCode: string) {
    const table = await this.tablesService.findByQrCode(qrCode);
    const categories = await this.categoriesService.findAll(false);
    const menuItems = await this.menuItemsService.findAll(false);

    return {
      table,
      categories,
      menuItems
    };
  }
}
