import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CategoriesService } from '../categories/categories.service';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { TablesService } from '../tables/tables.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly categoriesService: CategoriesService,
    private readonly menuItemsService: MenuItemsService,
    private readonly tenantContext: TenantContextService
  ) {}

  @Get('menu/:qrCode')
  async getMenu(@Param('qrCode') qrCode: string) {
    const tenant = this.tenantContext.current();
    if (!tenant || !['TRIAL', 'ACTIVE', 'PAST_DUE'].includes(tenant.status)) throw new ForbiddenException('Restaurant is unavailable');
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
